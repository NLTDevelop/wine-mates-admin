import { useQuery } from '@tanstack/react-query'
import { EventFiltersData } from '../entities/types'
import { eventQueries } from '../entities/event-list-queries'

export const useEventFilters = () => {
  const { data: filterOptions, isLoading, error } = useQuery<EventFiltersData>(eventQueries.filters())

  const getCurrencyFilterOptions = () => {
    if (!filterOptions?.currency) return []

    return filterOptions.currency.map(c => ({ label: c.name, value: c.id }))
  }

  const getLanguageFilterOptions = () => {
    if (!filterOptions?.language) return []

    return filterOptions.language.map(l => ({ label: l.name, value: l.id }))
  }

  const getTastingTypeFilterOptions = () => {
    if (!filterOptions?.tastingType) return []

    return filterOptions.tastingType.map(tt => ({ label: tt.name, value: tt.id }))
  }

  const getFilterLabel = (column: string, value: any): string => {
    if (value === null || value === undefined) return ''

    switch (column) {
      case 'currency':
        return filterOptions?.currency.find(c => c.id === value)?.name || value.toString()
      case 'language':
        return filterOptions?.language.find(l => l.id === value)?.name || value.toString()
      case 'tastingType':
        return filterOptions?.tastingType.find(tt => tt.id === value)?.name || value.toString()
      default:
        return value.toString()
    }
  }

  return {
    filterOptions,
    isLoading,
    error,
    getCurrencyFilterOptions,
    getTastingTypeFilterOptions,
    getLanguageFilterOptions,
    getFilterLabel,
  }
}
