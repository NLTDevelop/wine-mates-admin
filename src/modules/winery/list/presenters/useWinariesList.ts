import { keepPreviousData, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useWineryStore } from '../entities/wineries-list-store'
import { wineriesQueries } from '../entities/wineries-list-queries'
import { IWinery, WineriesResponse, WineriesType } from '../entities/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

export const useWineriesList = () => {
  const { activeTab, filters, setFilters, resetFilters, setActiveTab } = useWineryStore()

  const queryClient = useQueryClient()

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedWineryId, setSelectedWineryId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  const [winery, setWinery] = useState<{ wineryName: string; status: WineriesType }>({ wineryName: '', status: 'approved' })

   const queryFilters = { ...filters,status: activeTab }

  const wineriesQuery: UseQueryResult<WineriesResponse | undefined, Error> = useQuery({
    ...wineriesQueries.list(queryFilters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const confirmWineryMutation = useMutation({
    ...wineriesQueries.confirm(),
    onMutate: async ({ id, status }: { id: string; status: WineriesType }) => {
      await queryClient.cancelQueries({ queryKey: ['wineries', 'list', filters] })

      const previousWineries = queryClient.getQueryData<WineriesResponse>(['wineries', 'list', filters])

      if (previousWineries) {
        const updatedWineries = {
          ...previousWineries,
          rows: previousWineries.rows.map((winery: IWinery) => (winery.id.toString() === id ? { ...winery, status } : winery)),
        }

        queryClient.setQueryData(['wineries', 'list', filters], updatedWineries)
      }

      return { previousWineries }
    },
    onError: (_, __, context) => {
      if (context?.previousWineries) {
        queryClient.setQueryData(['wineries', 'list', filters], context.previousWineries)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wineries', 'list', filters] })
    },
  })

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setFilters({ search: searchValue, page: 1 })
  }, 500)

  const findWineryById = useCallback(
    (wineryId: string) => {
      return wineriesQuery.data?.rows.find((winery: IWinery) => winery.id.toString() === wineryId)
    },
    [wineriesQuery.data?.rows]
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

  const handleColumnFilter = useCallback(
    (column: string, value: any) => {
      let filterColumn = column
      if (column === 'country') filterColumn = 'countryId'
      else if (column === 'region') filterColumn = 'regionId'

      setFilters({
        [filterColumn]: value,
        page: 1,
      })
    },
    [setFilters]
  )

  const clearColumnFilters = useCallback(() => {
    const filtersToClear = ['countryId', 'regionId']

    filtersToClear.forEach(filter => {
      handleColumnFilter(filter, null)
    })

    setFilters({ page: 1 })
  }, [handleColumnFilter, setFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setFilters({ page })
    },
    [setFilters]
  )

  const handleTabChange = useCallback(
    (tab: WineriesType) => {
      setActiveTab(tab)
      setSearchValue('')
      setFilters({
        search: '',
        limit: DEFAULT_PAGINATION_LIMIT,
        page: 1,
        countryId: null,
        regionId: null,
      })
    },
    [setActiveTab, setFilters]
  )

  const openConfirmModal = useCallback(
    (wineryId?: string) => {
      wineryId && setSelectedWineryId(wineryId)

      if (!wineryId) return
      const wineryFound = findWineryById(wineryId)
      if (wineryFound) {
        setWinery({
          wineryName: wineryFound.name || '',
          status: wineryFound.status || 'pending',
        })
      }

      setIsConfirmModalOpen(true)
    },
    [findWineryById]
  )

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
    setSelectedWineryId(null)
    setWinery({ wineryName: '', status: 'approved' })
  }, [])

  const confirmWinery = useCallback(async () => {
    if (selectedWineryId) {
      await confirmWineryMutation.mutateAsync({ id: selectedWineryId, status: 'approved' })
      wineriesQuery.refetch()
      closeConfirmModal()
    }
  }, [selectedWineryId, confirmWineryMutation, wineriesQuery])

  const rejectWinery = useCallback(async () => {
    if (selectedWineryId) {
      await confirmWineryMutation.mutateAsync({ id: selectedWineryId, status: 'rejected' })
      wineriesQuery.refetch()
      closeConfirmModal()
    }
  }, [selectedWineryId, confirmWinery, closeConfirmModal])

  return {
    wineries: wineriesQuery.data?.rows,
    totalCount: wineriesQuery.data?.count,
    isLoading: wineriesQuery.isLoading,
    isFetching: wineriesQuery.isFetching,
    activeTab,
    filters,
    searchValue,

    handleColumnFilter,
    clearColumnFilters,

    columnFilters: {
      countryId: filters.countryId,
      regionId: filters.regionId,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,
    handleTabChange,

    confirmWinery,
    confirmModal: {
      isOpen: isConfirmModalOpen,
      selectedWineryId,
      open: openConfirmModal,
      close: closeConfirmModal,
      reject: rejectWinery,
      confirm: confirmWinery,
    },
    wineryToConfirm: winery,
  }
}
