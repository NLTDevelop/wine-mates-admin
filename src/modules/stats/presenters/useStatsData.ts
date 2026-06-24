import { useState, useCallback } from 'react'
import { GenderData, IOverallStats, StatsFilters } from '../entities/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { statsQueries } from '../entities/stats-queries'

export const useStatsData = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all')

  const filters: StatsFilters = {
    year: selectedYear === 'all' ? undefined : Number(selectedYear),
    gender: selectedGender === 'all' ? undefined : (String(selectedGender) as 'male' | 'female'),
  }

  const summaryStatsQuery: UseQueryResult<IOverallStats | undefined, Error> = useQuery(statsQueries.summary(filters))
  const statsQuery: UseQueryResult<GenderData | undefined, Error> = useQuery(statsQueries.activity(filters))

  const ageGroups = ['18-25', '25-45', '46-60', '60+']

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year)
  }, [])

  const handleGenderChange = useCallback((gender: 'male' | 'female' | 'all') => {
    setSelectedGender(gender)
  }, [])

  const resetFilters = useCallback(() => {
    setSelectedYear('all')
    setSelectedGender('all')
  }, [])

  return {
    statsData: statsQuery?.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,

    selectedYear,
    selectedGender,

    ageGroups,

    overallStats: summaryStatsQuery.data,
    isLoadingOverallStats: summaryStatsQuery.isFetching && !summaryStatsQuery.data,

    setSelectedYear: handleYearChange,
    setSelectedGender: handleGenderChange,
    resetFilters,
  }
}
