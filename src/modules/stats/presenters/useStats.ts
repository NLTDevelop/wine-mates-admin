import { useState, useCallback } from 'react'
import { useTableData } from './useTableData'
import { useStatsData } from './useStatsData'

export const useStats = () => {
  const [activeTab, setActiveTab] = useState<string>('heatmap')

  const table = useTableData()
  const summary = useStatsData()

  const handleYearChange = useCallback(
    (year: string) => {
      table.setSelectedYear(year)
      summary.setSelectedYear(year)
    },
    [table, summary]
  )

  const handleGenderChange = useCallback(
    (gender: 'male' | 'female' | 'all') => {
      table.setSelectedGender(gender)
      summary.setSelectedGender(gender)
    },
    [table, summary]
  )

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const resetAllFilters = useCallback(() => {
    table.resetFilters()
    summary.resetFilters()
  }, [table, summary])

  return {
    activeTab,
    selectedYear: table.selectedYear,
    selectedGender: table.selectedGender,

    tableData: table.aggregatedData,
    tableTotalCount: table.totalCount,
    tableFilters: table.filters,
    years: table.years,

    statsData: summary.statsData,
    aggregatedData: summary.statsData,
    overallStats: summary.overallStats,
    ageGroups: summary.ageGroups,

    isLoading: table.isLoading || summary.isLoading,
    isTableLoading: table.isLoading,
    isSummaryLoading: summary.isLoadingOverallStats,

    setActiveTab: handleTabChange,
    setSelectedYear: handleYearChange,
    setSelectedGender: handleGenderChange,
    onChangePagination: table.onChangePagination,
    resetAllFilters,
  }
}
