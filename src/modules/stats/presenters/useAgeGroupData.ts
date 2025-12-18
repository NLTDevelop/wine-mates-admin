import { useCallback } from 'react'
import { YearData, WineRating } from '../entities/types'

const getSafeRating = (data: YearData[], ageGroup: string, gender: 'male' | 'female'): WineRating | null => {
  const ratings = data
    .map(d => d.data[gender][ageGroup])
    .filter((rating): rating is WineRating => rating !== undefined && rating !== null)
  
  if (ratings.length === 0) return null
  
  const totalRatingsCount = ratings.reduce((sum, item) => sum + item.ratingsCount, 0)
  return {
    ratingsCount: totalRatingsCount,
    averageRating: ratings.reduce((sum, item) => sum + item.averageRating * item.ratingsCount, 0) / totalRatingsCount,
  }
}

export const useAgeGroupData = (data: YearData[], selectedYear: string) => {
  const calculateAgeGroupData = useCallback((ageGroup: string) => {
    let maleData: WineRating | null = null
    let femaleData: WineRating | null = null

    if (selectedYear === 'all') {
      maleData = getSafeRating(data, ageGroup, 'male')
      femaleData = getSafeRating(data, ageGroup, 'female')
    } else {
      const yearData = data.find(d => d.year === parseInt(selectedYear))
      maleData = yearData?.data.male[ageGroup] || null
      femaleData = yearData?.data.female[ageGroup] || null
    }

    const totalRatings = (maleData?.ratingsCount || 0) + (femaleData?.ratingsCount || 0)
    const malePercent = totalRatings > 0 ? (((maleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'
    const femalePercent = totalRatings > 0 ? (((femaleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'

    return {
      maleData,
      femaleData,
      totalRatings,
      malePercent,
      femalePercent
    }
  }, [data, selectedYear])

  return {
    calculateAgeGroupData
  }
}