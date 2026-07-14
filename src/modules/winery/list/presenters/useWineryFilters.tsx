import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'

export const useWineryFilters = () => {
  const { countries, isLoading: isCountriesLoading } = useCountryOptions({})

  const getCountryFilterOptions = () => {
    if (!countries || countries.length === 0) return []

    return countries.map(country => ({
      label: country.name,
      value: country.id,
    }))
  }

  return {
    isLoading: isCountriesLoading,
    getCountryFilterOptions,
  }
}
