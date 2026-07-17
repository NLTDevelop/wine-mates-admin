import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { Image, IWines, UpdateWineListParams, WineImage, WinesResponse } from '../entities/types/types'
import { useWineStore } from '../entities/wine-list-store'
import { wineQueries } from '../entities/wine-list-queries'
import { WineFormData } from '../../create-wine/presenters/wine-form-schema'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { SORT_FIELDS } from '@/constatnts/wine-filters'

export const useWineList = (initialWineryId?: string | null, context: 'default' | 'winery' | 'withoutWinery' = 'default') => {
  const { filters, wineryFilters, winesWithoutWineryFilters, setWineryFilters, setWinesWithoutWineryFilters, resetWineryFilters, resetWinesWithoutWineryFilters, resetFilters } = useWineStore()
  const { toast } = useToast()
  const { t } = useTranslation('wines')

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [editingWine, setEditingWine] = useState<IWines | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wineId: string | null; wineName: string }>({ isOpen: false, wineId: null, wineName: '' })
  const [wine, setWine] = useState<{ wineName: string; isConfirm: boolean }>({ wineName: '', isConfirm: false })
  const [importModal, setImportModal] = useState<{ isOpen: boolean }>({ isOpen: false })
  const [isInitialized, setIsInitialized] = useState(false)

  const currentFilters = useMemo(() => {
    switch (context) {
      case 'winery':
        return wineryFilters
      case 'withoutWinery':
        return winesWithoutWineryFilters
      default:
        return filters
    }
  }, [context, filters, wineryFilters, winesWithoutWineryFilters])

  const setCurrentFilters = useMemo(() => {
    switch (context) {
      case 'winery':
        return setWineryFilters
      case 'withoutWinery':
        return setWinesWithoutWineryFilters
      default:
        return useWineStore.getState().setFilters
    }
  }, [context, setWineryFilters, setWinesWithoutWineryFilters])

  const resetCurrentFilters = useCallback(() => {
    switch (context) {
      case 'winery':
        return resetWineryFilters()
      case 'withoutWinery':
        return resetWinesWithoutWineryFilters()
      default:
        return resetFilters()
    }
  }, [context, resetWineryFilters, resetWinesWithoutWineryFilters, resetFilters])

  useEffect(() => {
    if (initialWineryId && context === 'winery' && !isInitialized) {
      setCurrentFilters({
        wineryId: initialWineryId,
        page: 1,
      })
      setIsInitialized(true)
    }
  }, [initialWineryId, context, setCurrentFilters, isInitialized])

  const winesQuery: UseQueryResult<WinesResponse | undefined, Error> = useQuery({
    ...wineQueries.list(currentFilters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const updateWineMutation = useMutation(wineQueries.update())
  const deleteWineMutation = useMutation({
    ...wineQueries.delete(),
    onSuccess: () => {
      toast({
        title: t('wine_deleted'),
        variant: 'default',
      })
    },
  })
  const confirmWineMutation = useMutation(wineQueries.confirmWine())
  const importWinesMutation = useMutation(wineQueries.import())

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setCurrentFilters({ search: searchValue, page: 1 })
  }, 500)

  const findWineById = useCallback(
    (wineId: string) => {
      return winesQuery.data?.rows.find((wine: IWines) => wine.id === wineId)
    },
    [winesQuery.data?.rows]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      debouncedWrapper(e.target.value)
    },
    [debouncedWrapper]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
    resetCurrentFilters()
  }, [resetCurrentFilters])

  const handleSort = useCallback(
    (column?: string) => {
      if (!column) {
        setCurrentFilters({
          sortBy: undefined,
          page: 1,
        })
        return
      }
      const baseField = SORT_FIELDS[column] || column
      const currentSortBy = currentFilters.sortBy || ''

      const isCurrentColumn = currentSortBy === `${baseField}_asc` || currentSortBy === `${baseField}_desc`

      if (isCurrentColumn) {
        const newOrder = currentSortBy.endsWith('_asc') ? 'desc' : 'asc'
        setCurrentFilters({
          sortBy: `${baseField}_${newOrder}`,
          page: 1,
        })
      } else {
        setCurrentFilters({
          sortBy: `${baseField}_asc`,
          page: 1,
        })
      }
    },
    [setCurrentFilters, currentFilters.sortBy]
  )

  const handleColumnFilter = useCallback(
    (column: string, value: any) => {
      let filterColumn = column
      if (column === 'country') filterColumn = 'countryId'
      else if (column === 'region') filterColumn = 'regionId'
      else if (column === 'type') filterColumn = 'typeId'
      else if (column === 'color') filterColumn = 'colorId'

      setCurrentFilters({
        [filterColumn]: value,
        page: 1,
      })
    },
    [setCurrentFilters]
  )

  const clearColumnFilters = useCallback(() => {
    const filtersToClear = ['colorId', 'typeId', 'vintage', 'countryId', 'regionId']

    filtersToClear.forEach(filter => {
      handleColumnFilter(filter, null)
    })

    handleSort(undefined)
    setCurrentFilters({ page: 1 })
  }, [handleColumnFilter, handleSort, setCurrentFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setCurrentFilters({ page })
    },
    [setCurrentFilters]
  )

  const startEditing = useCallback((wine: IWines) => {
    setEditingWine(wine)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingWine(null)
  }, [])

  const updateWine = useCallback(
    async (params: UpdateWineListParams) => {
      await updateWineMutation.mutateAsync(params)
      winesQuery.refetch()
      setEditingWine(null)
    },
    [updateWineMutation, winesQuery]
  )
  const transformWineImageToImage = (wineImage: WineImage): Image => {
    return {
      id: '',
      url: wineImage.originalUrl,
      thumbnailUrl: wineImage.smallUrl,
      alt: wineImage.originalName,
      order: 0,
      fileSize: wineImage.size,
      mimeType: wineImage.mimetype,
    }
  }
  const transformWineForUpdate = (wineData: Partial<IWines>): WineFormData => {
    const { country, region, type, color, image, ...rest } = wineData

    return {
      id: rest.id || '',
      name: rest.name || '',
      vintage: rest.vintage ?? null,
      producer: rest.producer || '',
      grapeVariety: rest.grapeVariety || '',
      countryId: country?.id ? Number(country.id) : null,
      regionId: region?.id ? Number(region.id) : null,
      typeId: type?.id ? Number(type.id) : null,
      colorId: color?.id ? Number(color.id) : null,
      image: image ? transformWineImageToImage(image) : null,
    }
  }

  const saveWineChanges = useCallback(
    async (updatedData: Partial<IWines>) => {
      if (editingWine?.id) {
        const updateData = transformWineForUpdate(updatedData)

        await updateWine({
          id: editingWine.id,
          data: updateData,
        })
      }
    },
    [editingWine, updateWine]
  )
  const deleteWine = useCallback(
    async (wineId: string) => {
      await deleteWineMutation.mutateAsync(wineId)
      winesQuery.refetch()
      closeDeleteModal()
    },
    [deleteWineMutation, winesQuery]
  )

  const openDeleteModal = useCallback((wineId: string, wineName: string = '') => {
    setDeleteModal({
      isOpen: true,
      wineId,
      wineName,
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      wineId: null,
      wineName: '',
    })
  }, [])

  const openConfirmModal = useCallback(
    (wineId?: string) => {
      wineId && setSelectedWineId(wineId)

      if (!wineId) return
      const wineFound = findWineById(wineId)
      if (wineFound) {
        setWine({
          wineName: wineFound.name || '',
          isConfirm: wineFound.isConfirmed ?? false,
        })
      }

      setIsConfirmModalOpen(true)
    },
    [findWineById]
  )

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
    setSelectedWineId(null)
    setWine({ wineName: '', isConfirm: false })
  }, [])

  const confirmDeleteWine = useCallback(async () => {
    if (deleteModal.wineId) {
      await deleteWine(deleteModal.wineId)
    }
  }, [deleteModal.wineId, deleteWine])

  const confirmWine = useCallback(
    async (userId: string, isConfirmed: boolean) => {
      await confirmWineMutation.mutateAsync({ id: userId, isConfirmed })
      winesQuery.refetch()
    },
    [confirmWineMutation, winesQuery]
  )

  const confirmWineExistence = useCallback(async () => {
    if (selectedWineId) {
      await confirmWine(selectedWineId, true)
      closeConfirmModal()
    }
  }, [selectedWineId, confirmWine, closeConfirmModal])

  const rejectWine = useCallback(async () => {
    if (selectedWineId) {
      await confirmWine(selectedWineId, false)
      closeConfirmModal()
    }
  }, [selectedWineId, confirmWine, closeConfirmModal])

  const openImportModal = useCallback(() => {
    setImportModal({ isOpen: true })
  }, [])

  const closeImportModal = useCallback(() => {
    setImportModal({ isOpen: false })
  }, [])

  const importWines = useCallback(
    async (file: File) => {
      try {
        await importWinesMutation.mutateAsync(file)

        toast({
          title: t('import_success'),
          variant: 'default',
        })
        winesQuery.refetch()
        closeImportModal()
      } catch (error) {
        toast({
          title: t('import_error'),
          variant: 'destructive',
        })
      }
    },
    [importWinesMutation, winesQuery, closeImportModal, t]
  )

  const refetch = useCallback(() => {
    return winesQuery.refetch()
  }, [winesQuery])

  return {
    wines: winesQuery.data?.rows,
    totalCount: winesQuery.data?.count,
    isLoading: winesQuery.isLoading,
    isFetching: winesQuery.isFetching,
    refetch,
    filters: currentFilters,
    searchValue,
    editingWine,

    sortBy: currentFilters.sortBy,
    handleSort,
    handleColumnFilter,
    clearColumnFilters,

    columnFilters: {
      typeId: currentFilters.typeId,
      colorId: currentFilters.colorId,
      vintage: currentFilters.vintage,
      countryId: currentFilters.countryId,
      regionId: currentFilters.regionId,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

    confirmWine,
    confirmModal: {
      isOpen: isConfirmModalOpen,
      selectedWineId,
      open: openConfirmModal,
      close: closeConfirmModal,
      reject: rejectWine,
      confirm: confirmWineExistence,
    },
    wineToConfirm: wine,

    startEditing,
    cancelEditing,
    saveWineChanges,
    isUpdating: updateWineMutation.isPending,

    deleteWine: openDeleteModal,
    isDeleting: deleteWineMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteWine,
    },

    importWines: {
      import: importWines,
      openModal: openImportModal,
      closeModal: closeImportModal,
      isImporting: importWinesMutation.isPending,
      isOpen: importModal.isOpen,
    },
    isInitialized,
  }
}
