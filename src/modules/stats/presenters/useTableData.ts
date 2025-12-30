import { useState, useMemo, useCallback } from 'react'
import { GenderData, StatsFilters, StatsTableResponse } from '../entities/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { statsQueries } from '../entities/stats-queries'

export const useTableData = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all')
  const [filters, setFilters] = useState<StatsFilters>({
    limit: 10,
    page: 1,
    year: undefined,
    gender: undefined,
  })

  const statsTableQuery: UseQueryResult<StatsTableResponse | undefined, Error> = useQuery(statsQueries.list(filters))

  const ageGroups = ['18-25', '25-45', '46-60', '60+']

  const years = useMemo(() => {
    return statsTableQuery.data?.rows?.map(d => d.year) || []
  }, [statsTableQuery.data?.rows])

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year)
    setFilters(prev => ({
      ...prev,
      page: 1,
      year: year === 'all' ? undefined : parseInt(year),
    }))
  }, [])

  const handleGenderChange = useCallback((gender: 'male' | 'female' | 'all') => {
    setSelectedGender(gender)
    setFilters(prev => ({
      ...prev,
      page: 1,
      gender: gender === 'all' ? undefined : gender,
    }))
  }, [])

  const onChangePagination = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const filteredData = useMemo(() => {
    if (!statsTableQuery.data?.rows) return []

    if (selectedYear === 'all') return statsTableQuery.data.rows

    return statsTableQuery.data.rows.filter(d => d.year === parseInt(selectedYear))
  }, [statsTableQuery.data?.rows, selectedYear])

  const aggregatedData = useMemo(() => {
    const result: Record<string, any> = {}

    filteredData.forEach(yearData => {
      const genders = selectedGender === 'all' ? ['male', 'female'] : [selectedGender]

      genders.forEach(gender => {
        ageGroups.forEach(ageGroup => {
          const key = `${yearData.year}-${gender}-${ageGroup}`
          const ratingData = (yearData.data as GenderData)[gender as keyof GenderData]?.[ageGroup]

          if (ratingData) {
            result[key] = {
              ...ratingData,
              year: yearData.year,
              gender,
              ageGroup,
            }
          }
        })
      })
    })

    return result
  }, [filteredData, selectedGender, ageGroups])

  const resetFilters = useCallback(() => {
    setSelectedYear('all')
    setSelectedGender('all')
    setFilters({
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
    })
  }, [])

  return {
    totalCount: statsTableQuery.data?.count || 0,
    isLoading: statsTableQuery.isLoading,
    isError: statsTableQuery.isError,

    selectedYear,
    selectedGender,
    filters,

    ageGroups,
    years,
    filteredData,
    aggregatedData,

    setSelectedYear: handleYearChange,
    setSelectedGender: handleGenderChange,
    onChangePagination,
    resetFilters,
  }
}
