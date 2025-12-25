import { useState, useMemo, useCallback } from 'react'
import { GenderData, IOverallStats /*, StatsFilters, StatsResponse, WineRating*/ } from '../entities/types'
// import { useQuery, UseQueryResult } from '@tanstack/react-query'
// import { statsQueries } from '../entities/stats-queries'

const mockData = {
  data: [
    {
      year: 2025,
      data: {
        male: {
          '18-25': { ratingsCount: 150, averageRating: 4.2 },
          '25-45': { ratingsCount: 320, averageRating: 3.8 },
          '46-60': { ratingsCount: 210, averageRating: 2.5 },
          '60+': { ratingsCount: 95, averageRating: 1.9 },
        },
        female: {
          '18-25': { ratingsCount: 180, averageRating: 0.5 },
          '25-45': { ratingsCount: 290, averageRating: 4.1 },
          '46-60': { ratingsCount: 170, averageRating: 4.7 },
          '60+': { ratingsCount: 80, averageRating: 5.0 },
        },
      },
    },
    {
      year: 2024,
      data: {
        male: {
          '18-25': { ratingsCount: 130, averageRating: 4.9 },
          '25-45': { ratingsCount: 300, averageRating: 3.6 },
          '46-60': { ratingsCount: 190, averageRating: 3.3 },
          '60+': { ratingsCount: 85, averageRating: 4.7 },
        },
        female: {
          '18-25': { ratingsCount: 160, averageRating: 4.3 },
          '25-45': { ratingsCount: 270, averageRating: 2.9 },
          '46-60': { ratingsCount: 150, averageRating: 4.5 },
          '60+': { ratingsCount: 75, averageRating: 4.9 },
        },
      },
    },
  ],
}

export const useStatsData = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all')

  // const statsQuery: UseQueryResult<StatsResponse[] | undefined, Error> = useQuery(statsQueries.summary())
  const statsQuery = mockData

  const ageGroups = ['18-25', '25-45', '46-60', '60+']

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year)
  }, [])

  const handleGenderChange = useCallback((gender: 'male' | 'female' | 'all') => {
    setSelectedGender(gender)
  }, [])

  const filteredData = useMemo(() => {
    if (!statsQuery.data) return []

    if (selectedYear === 'all') return statsQuery.data

    return statsQuery.data.filter(d => d.year === parseInt(selectedYear))
  }, [statsQuery.data, selectedYear])

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

  const overallStats: IOverallStats = useMemo(() => {
    const allRatings = Object.values(aggregatedData).flatMap((d: any) => Array(d.ratingsCount).fill(d.averageRating))

    const totalRatings = allRatings.length
    const averageRating = totalRatings > 0 ? allRatings.reduce((a: number, b: number) => a + b, 0) / totalRatings : 0

    let mostActive = { ageGroup: '', gender: '', count: 0 }
    Object.values(aggregatedData).forEach((d: any) => {
      if (d.ratingsCount > mostActive.count) {
        mostActive = {
          ageGroup: d.ageGroup,
          gender: d.gender,
          count: d.ratingsCount,
        }
      }
    })

    let highestRating = { ageGroup: '', gender: '', rating: 0 }
    Object.values(aggregatedData).forEach((d: any) => {
      if (d.averageRating > highestRating.rating) {
        highestRating = {
          ageGroup: d.ageGroup,
          gender: d.gender,
          rating: d.averageRating,
        }
      }
    })

    return { totalRatings, averageRating, mostActive, highestRating }
  }, [aggregatedData])

  const years = useMemo(() => {
    if (!statsQuery.data) return []
    return Array.from(new Set(statsQuery.data.map(d => d.year))).sort((a, b) => b - a)
  }, [statsQuery.data])

  const resetFilters = useCallback(() => {
    setSelectedYear('all')
    setSelectedGender('all')
  }, [])

  return {
    // statsData: mockData.data || [],
    statsData: statsQuery.data || [],
    // isLoading: statsQuery.isLoading,
    // isError: statsQuery.isError,

    selectedYear,
    selectedGender,
    years,

    ageGroups,
    filteredData,
    aggregatedData,
    overallStats,

    setSelectedYear: handleYearChange,
    setSelectedGender: handleGenderChange,
    resetFilters,
  }
}
