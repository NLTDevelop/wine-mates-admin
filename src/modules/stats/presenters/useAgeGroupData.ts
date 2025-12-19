import { useMemo } from 'react'
import { StatsResponse } from '../entities/types'

export const useAgeGroupData = (data: StatsResponse[], selectedYear: string, ageGroups: string[]) => {
  const allAgeGroupData = useMemo(() => {
    return ageGroups.map(ageGroup => {
      let maleData = null
      let femaleData = null

      if (selectedYear === 'all') {
        const allMaleRatings = data.map(d => d.data.male[ageGroup]).filter(Boolean)
        const allFemaleRatings = data.map(d => d.data.female[ageGroup]).filter(Boolean)

        if (allMaleRatings.length > 0) {
          maleData = {
            ratingsCount: allMaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
            averageRating: allMaleRatings.reduce((sum, item) => sum + item.averageRating * item.ratingsCount, 0) / allMaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
          }
        }

        if (allFemaleRatings.length > 0) {
          femaleData = {
            ratingsCount: allFemaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
            averageRating: allFemaleRatings.reduce((sum, item) => sum + item.averageRating * item.ratingsCount, 0) / allFemaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
          }
        }
      } else {
        const yearData = data.find(d => d.year === parseInt(selectedYear))
        maleData = yearData?.data.male[ageGroup] || null
        femaleData = yearData?.data.female[ageGroup] || null
      }

      const totalRatings = (maleData?.ratingsCount || 0) + (femaleData?.ratingsCount || 0)
      const malePercent = totalRatings > 0 ? (((maleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'
      const femalePercent = totalRatings > 0 ? (((femaleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'

      return {
        ageGroup,
        maleData,
        femaleData,
        totalRatings,
        malePercent,
        femalePercent,
      }
    })
  }, [data, selectedYear, ageGroups])

  return allAgeGroupData
}
