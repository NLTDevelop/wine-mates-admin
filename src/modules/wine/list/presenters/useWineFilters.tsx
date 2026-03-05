import { useQuery } from '@tanstack/react-query'
import { wineQueries } from '../entities/wine-list-queries'
import { WineFiltersData } from '../entities/types/types'

export const useWineFilters = () => {
  const { data: filterOptions, isLoading, error } = useQuery<WineFiltersData>(wineQueries.filters())

  const getColorFilterOptions = () => {
    if (!filterOptions?.colors) return []

    return filterOptions.colors.map(color => ({
      label: color.name,
      value: color.id,
      icon: <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color.colorHex || '#ccc' }} />,
    }))
  }

  const getTypeFilterOptions = () => {
    if (!filterOptions?.types) return []

    return filterOptions.types.map(type => ({
      label: type.name,
      value: type.id,
    }))
  }

  const getCountryFilterOptions = () => {
    if (!filterOptions?.countries) return []

    return filterOptions.countries.map(country => ({
      label: country.name,
      value: country.id,
    }))
  }

  const getVintageFilterOptions = () => {
    if (!filterOptions?.vintages) return []

    return filterOptions.vintages
      .filter((v): v is number => v !== null)
      .sort((a, b) => b - a)
      .map(vintage => ({
        label: vintage.toString(),
        value: vintage,
      }))
  }

  const hasNullVintage = filterOptions?.vintages.includes(null) || false

  const getFilterLabel = (column: string, value: any): string => {
    if (value === null || value === undefined) return ''

    switch (column) {
      case 'colorId':
        return filterOptions?.colors.find(c => c.id === value)?.name || value.toString()
      case 'typeId':
        return filterOptions?.types.find(t => t.id === value)?.name || value.toString()
      case 'countryId':
        return filterOptions?.countries.find(c => c.id === value)?.name || value.toString()
      case 'vintage':
        return value === null ? 'Unknown' : value.toString()
      default:
        return value.toString()
    }
  }

  return {
    filterOptions,
    isLoading,
    error,
    getColorFilterOptions,
    getTypeFilterOptions,
    getCountryFilterOptions,
    getVintageFilterOptions,
    hasNullVintage,
    getFilterLabel,
  }
}
