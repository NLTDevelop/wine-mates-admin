import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'

import { Image, IWines, UpdateWineListParams, WineImage, WinesResponse } from '../entities/types/types'
import { useWineStore } from '../entities/wine-list-store'
import { wineQueries } from '../entities/wine-list-queries'
import { WineFormData } from '../../create-taste/presenters/wine-form-schema'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'

export const useWineList = () => {
  const { filters, setFilters, resetFilters } = useWineStore()
  const { toast } = useToast()
  const { t } = useTranslation('wines')

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [editingWine, setEditingWine] = useState<IWines | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wineId: string | null; wineName: string }>({ isOpen: false, wineId: null, wineName: '' })
  const [wine, setWine] = useState<{ wineName: string; isConfirm: boolean }>({ wineName: '', isConfirm: false })
  const [importModal, setImportModal] = useState<{ isOpen: boolean }>({ isOpen: false })

  const winesQuery: UseQueryResult<WinesResponse | undefined, Error> = useQuery(wineQueries.list(filters))
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
    setFilters({ search: searchValue, page: 1 })
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
    resetFilters()
  }, [resetFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
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

  return {
    wines: winesQuery.data?.rows,
    totalCount: winesQuery.data?.count,
    isLoading: winesQuery.isLoading,
    filters,
    searchValue,
    editingWine,

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
  }
}
