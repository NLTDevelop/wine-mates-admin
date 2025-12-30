import { useEffect, useState } from 'react'
import { ChartRange, DetailFilters, WineAnalysisUIResponse } from '../entities/chemical_types'
import { analysisQueries } from '../../entities/analysis-queries'
import { useQuery } from '@tanstack/react-query'
import { mockChemicalDetail } from '../entities/mockChemicalDetail'

export const useAnalyzedWineDetail = (wineId: string) => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [chartRange, setChartRange] = useState<ChartRange>('day')

  const filters: DetailFilters = {
    value: selectedDate,
    range: chartRange,
  }

  const query = useQuery<WineAnalysisUIResponse>(analysisQueries.detail(wineId, filters))

  // useEffect(() => {
  //   if (query.data?.availableDates?.[0] && !selectedDate) {
  //     setSelectedDate(query.data.availableDates[0])
  //   }
  // }, [query.data, selectedDate])

  useEffect(() => {
    if (mockChemicalDetail.availableDates?.[0] && selectedDate === '') {
      setSelectedDate(mockChemicalDetail.availableDates[0])
    }
  }, [selectedDate])

  return {
    data: query.data,

    wine: mockChemicalDetail.wine,
    analysisDate: mockChemicalDetail.analysis.date,
    sensory: mockChemicalDetail.analysis.sensory,
    chemical: mockChemicalDetail.analysis.chemical,
    charts: mockChemicalDetail.charts,
    reviews: mockChemicalDetail.analysis.reviews,
    // wine: query.data?.wine,
    // analysisDate: query.data?.analysis.date,
    // sensory: query.data?.analysis.sensory,
    // chemical: query.data?.analysis.chemical,
    // chemical: query.data?.analysis.reviews,
    // charts: query.data?.charts,

    selectedDate,
    setSelectedDate,
    availableDates: mockChemicalDetail.availableDates || [],
    // availableDates: query.data?.availableDates || [],

    chartRange,
    setChartRange,

    isLoading: query.isLoading,
    isError: query.isError,

    refetch: query.refetch,
  }
}
