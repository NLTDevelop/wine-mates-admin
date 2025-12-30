import { GenderData } from '../entities/types'

export const useAgeGroupData = (ageGroups: string[], genderFilter: 'male' | 'female' | 'all' = 'all', data?: GenderData) => {
  if (!data) {
    return []
  }

  const showData = {
    male: genderFilter === 'all' || genderFilter === 'male' ? data.male : {},
    female: genderFilter === 'all' || genderFilter === 'female' ? data.female : {},
  }

  if (genderFilter === 'all') {
    return ageGroups.map(ageGroup => {
      const maleData = showData.male?.[ageGroup]
      const femaleData = showData.female?.[ageGroup]

      const maleCount = maleData?.ratingsCount || 0
      const femaleCount = femaleData?.ratingsCount || 0
      const groupTotal = maleCount + femaleCount

      const malePercent = groupTotal > 0 ? ((maleCount / groupTotal) * 100).toFixed(1) : '0'
      const femalePercent = groupTotal > 0 ? ((femaleCount / groupTotal) * 100).toFixed(1) : '0'

      return {
        ageGroup,
        maleData,
        femaleData,
        malePercent,
        femalePercent,
        malePercentNum: parseFloat(malePercent),
        femalePercentNum: parseFloat(femalePercent),
        totalRatings: groupTotal,
        mode: 'all' as const,
      }
    })
  }

  const genderData = genderFilter === 'male' ? showData.male : showData.female

  let totalForGender = 0
  Object.values(genderData).forEach(rating => {
    totalForGender += rating.ratingsCount
  })

  return ageGroups.map(ageGroup => {
    const genderDataForAge = genderData[ageGroup]
    const otherGenderData = genderFilter === 'male' ? showData.female?.[ageGroup] : showData.male?.[ageGroup]

    const genderCount = genderDataForAge?.ratingsCount || 0
    const otherGenderCount = otherGenderData?.ratingsCount || 0

    const genderPercent = totalForGender > 0 ? ((genderCount / totalForGender) * 100).toFixed(1) : '0'

    return {
      ageGroup,
      maleData: genderFilter === 'male' ? genderDataForAge : undefined,
      femaleData: genderFilter === 'female' ? genderDataForAge : undefined,
      malePercent: genderFilter === 'male' ? genderPercent : '0',
      femalePercent: genderFilter === 'female' ? genderPercent : '0',
      malePercentNum: genderFilter === 'male' ? parseFloat(genderPercent) : 0,
      femalePercentNum: genderFilter === 'female' ? parseFloat(genderPercent) : 0,
      totalRatings: genderCount + otherGenderCount,
      mode: 'single' as const,
      totalForGender,
    }
  })
}
