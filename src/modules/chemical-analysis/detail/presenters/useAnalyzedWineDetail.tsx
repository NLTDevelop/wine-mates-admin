// import { useQuery } from '@tanstack/react-query'
// import { analysisQueries } from '../../entities/analysis-queries'
// import { useTranslation } from 'react-i18next'
// import { Beaker, ChefHat, MessageSquare } from 'lucide-react'
// import { useEffect, useState } from 'react'
// import { IWineAnalysisDetail, TasteHistoryResponse, CharacteristicsHistoryResponse, IChemicalMeasure } from '../entities/types'
// import { useCharacteristicsHistory } from './useCharacteristicsHistory'
// import { useTasteHistory } from './useTasteHistory'

// type TabType = 'analysis' | 'sensoryAnalysis' | 'reviews'
// type ChartRange = 'day' | 'month' | 'year'

// export const useAnalyzedWineDetail = (wineId: string) => {
//   const { t } = useTranslation('analysis')

//   const [selectedDate, setSelectedDate] = useState<string>('')
//   const [activeTab, setActiveTab] = useState<TabType>('analysis')
//   const [chartRange, setChartRange] = useState<ChartRange>('day')

//   const analysisQuery = useQuery<IWineAnalysisDetail>({
//     ...analysisQueries.detail(wineId),
//     enabled: !!wineId,
//   })

//   useEffect(() => {
//     if (analysisQuery.data?.analysisDates?.length && !selectedDate) {
//       const dates = analysisQuery.data.analysisDates
//       setSelectedDate(dates[dates.length - 1])
//     }
//   }, [analysisQuery.data, selectedDate])

//   const characteristicsQuery = useCharacteristicsHistory(wineId, selectedDate)

//   const tasteQuery = useTasteHistory(wineId, selectedDate)

//   const createChemicalMeasuresFromChart = (chartData: CharacteristicsHistoryResponse | undefined): {
//     sugarContent: IChemicalMeasure[]
//     ph: IChemicalMeasure[]
//     alcohol: IChemicalMeasure[]
//     volatileAcidity: IChemicalMeasure[]
//     totalAcidity: IChemicalMeasure[]
//   } => {
//     if (!chartData?.data || chartData.data.length === 0) {
//       return {
//         sugarContent: [],
//         ph: [],
//         alcohol: [],
//         volatileAcidity: [],
//         totalAcidity: [],
//       }
//     }

//     const lastDataPoint = chartData.data[chartData.data.length - 1]

//     return {
//       sugarContent: lastDataPoint.sugarContent !== undefined ? [{
//         value: lastDataPoint.sugarContent,
//         date: selectedDate
//       }] : [],
//       ph: lastDataPoint.ph !== undefined ? [{
//         value: lastDataPoint.ph,
//         date: selectedDate
//       }] : [],
//       alcohol: lastDataPoint.alcohol !== undefined ? [{
//         value: lastDataPoint.alcohol,
//         date: selectedDate
//       }] : [],
//       volatileAcidity: lastDataPoint.volatileAcidity !== undefined ? [{
//         value: lastDataPoint.volatileAcidity,
//         date: selectedDate
//       }] : [],
//       totalAcidity: lastDataPoint.totalAcidity !== undefined ? [{
//         value: lastDataPoint.totalAcidity,
//         date: selectedDate
//       }] : [],
//     }
//   }

//   const getCurrentSnapshot = () => {
//     const chartMeasures = createChemicalMeasuresFromChart(characteristicsQuery.data)

//     return {
//       sugarContent: chartMeasures.sugarContent.length > 0 ? chartMeasures.sugarContent : analysisQuery.data?.sugarContent || [],
//       ph: chartMeasures.ph.length > 0 ? chartMeasures.ph : analysisQuery.data?.ph || [],
//       alcohol: chartMeasures.alcohol.length > 0 ? chartMeasures.alcohol : analysisQuery.data?.alcohol || [],
//       volatileAcidity: chartMeasures.volatileAcidity.length > 0 ? chartMeasures.volatileAcidity : analysisQuery.data?.volatileAcidity || [],
//       totalAcidity: chartMeasures.totalAcidity.length > 0 ? chartMeasures.totalAcidity : analysisQuery.data?.totalAcidity || [],

//       freeSO2: analysisQuery.data?.freeSO2 || 0,
//       totalSO2: analysisQuery.data?.totalSO2 || 0,
//       density: analysisQuery.data?.density || 0,
//       malolactic: analysisQuery.data?.malolactic || false,
//       fermentationTemp: analysisQuery.data?.fermentationTemp || 0,
//     }
//   }

//   const getSensoryAnalysis = (): TasteHistoryResponse | undefined => {
//     if (tasteQuery.data) {
//       return tasteQuery.data
//     }

//     if (analysisQuery.data?.sensoryAnalysis) {
//       return analysisQuery.data.sensoryAnalysis
//     }

//     return undefined
//   }

//   const handleDateChange = (newDate: string) => {
//     setSelectedDate(newDate)
//   }

//   const tabs = [
//     { id: 'analysis' as TabType, label: t('chemical_analysis'), icon: <Beaker className="h-4 w-4" /> },
//     { id: 'sensoryAnalysis' as TabType, label: t('sensory_analysis'), icon: <ChefHat className="h-4 w-4" /> },
//     { id: 'reviews' as TabType, label: t('reviews'), icon: <MessageSquare className="h-4 w-4" /> },
//   ]

//   const isLoading = analysisQuery.isLoading ||
//     (activeTab === 'analysis' && characteristicsQuery.isLoading && !!selectedDate) ||
//     (activeTab === 'sensoryAnalysis' && tasteQuery.isLoading && !!selectedDate)

//   return {
//     analyzedWine: analysisQuery.data,

//     currentSnapshot: getCurrentSnapshot(),

//     sensoryAnalysis: getSensoryAnalysis(),

//     chartData: characteristicsQuery.data,

//     selectedDate,
//     availableDates: analysisQuery.data?.analysisDates || [],
//     chartRange,
//     setChartRange,

//     tabs,
//     activeTab,
//     setActiveTab,

//     isLoading,
//     isAnalysisLoading: analysisQuery.isLoading,
//     isChartLoading: characteristicsQuery.isLoading,
//     isSensoryLoading: tasteQuery.isLoading,

//     handleDateChange,

//     refetchAll: () => {
//       analysisQuery.refetch()
//       characteristicsQuery.refetch()
//       tasteQuery.refetch()
//     }
//   }
// }

//mock
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Beaker, ChefHat, MessageSquare } from 'lucide-react'
import { IWineAnalysisDetail, CharacteristicsHistoryResponse } from '../entities/types'
import {
  mockWineAnalysisDetail,
  mockWhiteWineAnalysisDetail,
  mockRoseWineAnalysisDetail,
  mockCharacteristicsHistory,
  mockMonthCharacteristicsHistory,
  mockYearCharacteristicsHistory,
} from '../entities/mockDetail'

type TabType = 'analysis' | 'sensoryAnalysis' | 'reviews'
type ChartRange = 'day' | 'month' | 'year'

export const useAnalyzedWineDetail = (wineId: string) => {
  const { t } = useTranslation('analysis')

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabType>('analysis')
  const [chartRange, setChartRange] = useState<ChartRange>('day')

  const getWineData = (): IWineAnalysisDetail => {
    switch (wineId) {
      case '2':
        return mockWhiteWineAnalysisDetail
      case '3':
        return mockRoseWineAnalysisDetail
      case '1':
      default:
        return mockWineAnalysisDetail
    }
  }

  const wineData = getWineData()

  useEffect(() => {
    if (!selectedDate && wineData.analysisDates.length > 0) {
      setSelectedDate(wineData.analysisDates[wineData.analysisDates.length - 1])
    }
  }, [wineData, selectedDate])

  const getChartData = (): CharacteristicsHistoryResponse => {
    switch (chartRange) {
      case 'month':
        return {
          ...mockMonthCharacteristicsHistory,
          selectedDate: selectedDate,
        }
      case 'year':
        return {
          ...mockYearCharacteristicsHistory,
          selectedDate: selectedDate,
        }
      case 'day':
      default:
        return {
          ...mockCharacteristicsHistory,
          selectedDate: selectedDate,
        }
    }
  }

  const getCurrentSnapshot = () => {
    const chartData = getChartData()
    const lastDataPoint = chartData.data[chartData.data.length - 1]

    return {
      sugarContent:
        lastDataPoint?.sugarContent !== undefined
          ? [
              {
                id: `${Date.now()}-sugar`,
                value: lastDataPoint.sugarContent,
                date: selectedDate,
              },
            ]
          : wineData?.sugarContent,
      ph:
        lastDataPoint?.ph !== undefined
          ? [
              {
                id: `${Date.now()}-ph`,
                value: lastDataPoint?.ph,
                date: selectedDate,
              },
            ]
          : wineData?.ph,
      alcohol:
        lastDataPoint?.alcohol !== undefined
          ? [
              {
                id: `${Date.now()}-alcohol`,
                value: lastDataPoint?.alcohol,
                date: selectedDate,
              },
            ]
          : wineData?.alcohol,
      volatileAcidity:
        lastDataPoint?.volatileAcidity !== undefined
          ? [
              {
                id: `${Date.now()}-volatile`,
                value: lastDataPoint?.volatileAcidity,
                date: selectedDate,
              },
            ]
          : wineData?.volatileAcidity,
      totalAcidity:
        lastDataPoint?.totalAcidity !== undefined
          ? [
              {
                id: `${Date.now()}-total`,
                value: lastDataPoint?.totalAcidity,
                date: selectedDate,
              },
            ]
          : wineData?.totalAcidity,
      freeSO2: wineData?.freeSO2,
      totalSO2: wineData?.totalSO2,
      density: wineData?.density,
      malolactic: wineData?.malolactic,
      fermentationTemp: wineData?.fermentationTemp,
    }
  }

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
  }

  const handleChartRangeChange = (range: ChartRange) => {
    setChartRange(range)
  }

  const tabs = [
    { id: 'analysis' as TabType, label: t('chemical_analysis'), icon: <Beaker className="h-4 w-4" /> },
    { id: 'sensoryAnalysis' as TabType, label: t('sensory_analysis'), icon: <ChefHat className="h-4 w-4" /> },
    { id: 'reviews' as TabType, label: t('reviews'), icon: <MessageSquare className="h-4 w-4" /> },
  ]

  return {
    analyzedWine: wineData,

    currentSnapshot: getCurrentSnapshot(),

    sensoryAnalysis: wineData.sensoryAnalysis,

    chartData: getChartData(),

    selectedDate,
    availableDates: wineData.analysisDates,
    chartRange,
    setChartRange: handleChartRangeChange,

    tabs,
    activeTab,
    setActiveTab,

    isLoading: false,
    isAnalysisLoading: false,
    isChartLoading: false,
    isSensoryLoading: false,

    handleDateChange,

    refetchAll: () => {},
  }
}
