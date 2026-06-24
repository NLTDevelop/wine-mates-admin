import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { useAnalysisStore } from '../../entities/analysis-store'
import { WineForAnalysisResponse } from '../entities/types'
import { analysisQueries } from '../../entities/analysis-queries'
import { mockWineForAnalysisResponse } from '../entities/mockWineForAnalysisResponse'

export const useAnalyzedWineList = () => {
  const { filters, setFilters, resetFilters } = useAnalysisStore()

  const [searchValue, setSearchValue] = useState<string>('')

  const analysisQuery: UseQueryResult<WineForAnalysisResponse | undefined, Error> = useQuery(analysisQueries.list(filters))

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

  return {
    analyzedWines: mockWineForAnalysisResponse.rows,
    // analyzedWine: analysisQuery.data?.rows,
    totalCount: analysisQuery.data?.count,
    isLoading: analysisQuery.isLoading,
    filters,
    searchValue,

    onChangeSearch: handleSearchChange,
    handleClearSearch,
    onChangePagination,
  }
}
