import { useCallback, useMemo } from 'react'
import { Country } from '../entities/types/location-types'
import { useCountriesQuery } from './useLocation'

interface UseCountryOptionsProps {
  cachedCountries?: Country[]
}

export const useCountryOptions = ({ cachedCountries = [] }: UseCountryOptionsProps) => {
  const { data: fetchedCountries, isLoading } = useCountriesQuery()

  const countries = useMemo(() => {
    return fetchedCountries || cachedCountries
  }, [fetchedCountries, cachedCountries])

  const fetchOptions = useCallback(
    async (search?: string) => {
      const options = countries?.map(country => ({
        value: country.id.toString(),
        label: country.name,
      }))

      if (search && search.trim()) {
        const term = search.toLowerCase()
        return options.filter(opt => opt.label.toLowerCase().includes(term))
      }

      return options
    },
    [countries]
  )

  return {
    fetchOptions,
    isLoading,
    countries,
  }
}
