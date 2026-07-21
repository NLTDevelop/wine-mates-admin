import { keepPreviousData,  useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useParams } from 'react-router-dom'
import { wineryWineListQueries } from '../entities/wine-list-queries'
import { useAddWinesStore } from '../entities/wine-list-store'
import { WinesResponse } from '@/modules/wine/list/entities/types/types'

export const useWineListEmptyWinery = () => {
  const { emptyWineryFilters, setEmptyWineryFilters, resetEmptyWineryFilters } = useAddWinesStore()
  const { id } = useParams<{ id: string }>()

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (searchValue !== (emptyWineryFilters.search || '')) {
      setSearchValue(emptyWineryFilters.search || '')
    }
  }, [emptyWineryFilters.search])

  const wineListEmptyWineryQuery: UseQueryResult<WinesResponse | undefined, Error> = useQuery({
    ...wineryWineListQueries.listWineEmptyWinery({ ...emptyWineryFilters, wineryId: parseInt(id!) }),
    placeholderData: keepPreviousData,
    staleTime: 2000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const { debouncedWrapper } = useDebounce((searchValue: string) => {
    setEmptyWineryFilters({ search: searchValue, page: 1 })
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
    resetEmptyWineryFilters()
  }, [resetEmptyWineryFilters])

  const onChangePagination = useCallback(
    (page: number) => {
      setEmptyWineryFilters({ page })
    },
    [setEmptyWineryFilters]
  )
  

  const handleColumnFilter = useCallback(
    (column: string, value: any) => {
      let filterColumn = column
      if (column === 'country') filterColumn = 'countryId'
      else if (column === 'region') filterColumn = 'regionId'
      else if (column === 'type') filterColumn = 'typeId'
      else if (column === 'color') filterColumn = 'colorId'

      console.log(filterColumn, value)
      setEmptyWineryFilters({
        [filterColumn]: value,
        page: 1,
      })
    },
    [setEmptyWineryFilters]
  )

  const clearColumnFilters = useCallback(() => {
    const filtersToClear = ['colorId', 'typeId', 'vintage', 'countryId', 'regionId']

    filtersToClear.forEach(filter => {
      handleColumnFilter(filter, null)
    })
    setEmptyWineryFilters({ page: 1 })
  }, [handleColumnFilter, setEmptyWineryFilters])

  return {
    winesEmptyWinery: wineListEmptyWineryQuery.data?.rows,
    totalCount: wineListEmptyWineryQuery.data?.count,
    isLoading: wineListEmptyWineryQuery.isLoading,
    isFetching: wineListEmptyWineryQuery.isFetching,
    emptyWineryFilters,
    searchValue,

    columnFilters: {
      typeId: emptyWineryFilters.typeId,
      colorId: emptyWineryFilters.colorId,
      vintage: emptyWineryFilters.vintage,
      countryId: emptyWineryFilters.countryId,
      regionId: emptyWineryFilters.regionId,
    },

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,
    handleColumnFilter,
    clearColumnFilters,
  }
}
