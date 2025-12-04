import { useQuery } from '@tanstack/react-query'
import { locationQueries } from '../entities/location-queries'

export const useCountriesQuery = (search?: string) => {
  return useQuery(locationQueries.countries(search))
}

export const useRegionsQuery = (countryId: string | number | null | undefined, search?: string) => {
  return useQuery(locationQueries.regions(countryId, search))
}
