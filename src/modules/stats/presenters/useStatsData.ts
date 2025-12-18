import { useState, useMemo } from 'react'
import { GenderData, IOverallStats, YearData } from '../entities/types'



export const useStatsData = (initialData: YearData[]) => {
  const [selectedYear, setSelectedYear] = useState<string>('all')
const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all')
  const [activeTab, setActiveTab] = useState<string>('overview')

  const ageGroups = ['18-25', '25-45', '46-60', '60+']
  const years = initialData.map(d => d.year)


  const filteredData = useMemo(() => {
    if (selectedYear === 'all') return initialData
    return initialData.filter(d => d.year === parseInt(selectedYear))
  }, [initialData, selectedYear])


  const aggregatedData = useMemo(() => {
    const result: any = {}

    filteredData.forEach(yearData => {
      const genders = selectedGender === 'all' ? ['male', 'female'] : [selectedGender]

      genders.forEach(gender => {
        ageGroups.forEach(ageGroup => {
          const key = `${yearData.year}-${gender}-${ageGroup}`
          const ratingData = yearData.data[gender as keyof GenderData]?.[ageGroup]

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
    const allRatings = Object.values(aggregatedData).flatMap((d: any) => 
      Array(d.ratingsCount).fill(d.averageRating)
    )

    const totalRatings = allRatings.length
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((a: number, b: number) => a + b, 0) / totalRatings 
      : 0

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
  


  return {
    selectedYear,
    setSelectedYear,
    selectedGender,
    setSelectedGender,
    activeTab,
    setActiveTab,
    
    ageGroups,
    years,
    filteredData,
    aggregatedData,
    overallStats,
   }
}