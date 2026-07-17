import { keepPreviousData, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useWineListOfWineryStore } from '../entities/winery-store'
import { AddWineToWineryParams, WineListOfWineryResponse } from '../entities/types'
import { wineryQueries } from '../entities/winery-queries'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const useWineListOfWinery = () => {
  const { filters, setFilters, resetFilters } = useWineListOfWineryStore()
  const { toast } = useToast()
  const { t } = useTranslation('winery')
  const { id } = useParams<{ id: string }>()

  const [searchValue, setSearchValue] = useState<string>('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; wineId: string | null; wineName: string }>({ isOpen: false, wineId: null, wineName: '' })

  const wineListOfWineryQuery: UseQueryResult<WineListOfWineryResponse | undefined, Error> = useQuery({
    ...wineryQueries.listWine(filters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
  const deleteWineMutation = useMutation({
    ...wineryQueries.deleteWine(),
    onSuccess: () => {
      toast({ title: t('wine_deleted'), variant: 'default' })
    },
  })

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, page: 1 })
  }, 500)

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

  const deleteWine = useCallback(
    async (wineId: number) => {
      if (!id) return
      const reqBody: AddWineToWineryParams = {
        wineryId: id,
        wineIds: [wineId],
      }
      await deleteWineMutation.mutateAsync(reqBody)
      wineListOfWineryQuery.refetch()
      closeDeleteModal()
    },
    [deleteWineMutation, wineListOfWineryQuery]
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

  const confirmDeleteWine = useCallback(async () => {
    if (deleteModal.wineId) {
      await deleteWine(Number(deleteModal.wineId))
    }
  }, [deleteModal.wineId, deleteWine])

  return {
    wines: wineListOfWineryQuery.data?.rows,
    totalCount: wineListOfWineryQuery.data?.count,
    isLoading: wineListOfWineryQuery.isLoading,
    isFetching: wineListOfWineryQuery.isFetching,
    filters,
    searchValue,

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,

    deleteWine: openDeleteModal,
    isDeleting: deleteWineMutation.isPending,

    deleteModal: {
      ...deleteModal,
      onClose: closeDeleteModal,
      onSubmit: confirmDeleteWine,
    },
  }
}
