import { keepPreviousData,  useQuery,  UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useWineryStore } from '../entities/wineries-list-store'
import { wineriesQueries } from '../entities/wineries-list-queries'
import {  WineriesResponse, WineriesType } from '../entities/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

export const useWineriesList = () => {
  const { activeTab, filters, setFilters, resetFilters, setActiveTab } = useWineryStore()

  const [searchValue, setSearchValue] = useState<string>('')


   const queryFilters = { ...filters,status: activeTab }

  const wineriesQuery: UseQueryResult<WineriesResponse | undefined, Error> = useQuery({
    ...wineriesQueries.list(queryFilters),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
  }
}
