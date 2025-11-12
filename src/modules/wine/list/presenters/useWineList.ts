import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'

import { IWines, UpdateWineListParams, WinesResponse } from '../entities/types/types'
import { useWineStore } from '../entities/wine-list-store'
import { wineQueries } from '../entities/wine-list-queries'

export const useWineList = () => {
  const { filters, setFilters, resetFilters } = useWineStore()

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [editingWine, setEditingWine] = useState<IWines | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wineId: string | null; wineName: string }>({ isOpen: false, wineId: null, wineName: '' })
  const [wine, setWine] = useState<{ wineName: string; isConfirm: boolean }>({ wineName: '', isConfirm: false })
  const [importModal, setImportModal] = useState<{ isOpen: boolean }>({ isOpen: false })

  const winesQuery: UseQueryResult<WinesResponse | undefined, Error> = useQuery(wineQueries.list(filters))
  const updateWineMutation = useMutation(wineQueries.update())
  const deleteWineMutation = useMutation(wineQueries.delete())
  const confirmWineMutation = useMutation(wineQueries.confirmWine())
  const importWinesMutation = useMutation(wineQueries.import())

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, offset: 0 })
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
    (offset: number) => {
      setFilters({ offset })
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

  const saveWineChanges = useCallback(
    async (updatedData: Partial<IWines>) => {
      if (editingWine?.id) {
        await updateWine({
          id: editingWine.id,
          data: { ...editingWine, ...updatedData },
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
          wineName: wineFound.displayName || '',
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
      await importWinesMutation.mutateAsync(file)
      winesQuery.refetch()
      closeImportModal()
    },
    [importWinesMutation, winesQuery, closeImportModal]
  )

  return {
    wines: winesQuery.data?.rows,
    totalCount: winesQuery.data?.totalCount,
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
