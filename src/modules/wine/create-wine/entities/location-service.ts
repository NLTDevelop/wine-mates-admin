import { api } from '@/services'
import { Country, Region } from './types/location-types'

type CountriesResponse = Country[] | { rows?: Country[]; data?: Country[]; count?: number }

const normalizeCountriesResponse = (response: CountriesResponse): Country[] => {
  if (Array.isArray(response)) return response
  return response.rows || response.data || []
}

export const locationService = {
  getCountries: (search?: string): Promise<Country[]> => {
    const params = {
      limit: 1000,
      ...(search ? { search } : {}),
    }
    return api.get('/v1/countries', { params }).then(response => normalizeCountriesResponse(response.data))
  },

  getRegions: (countryId: string | number, search?: string): Promise<Region[]> => {
    const params = search ? { search } : {}
    return api.get(`/v1/countries/${countryId}/regions`, { params }).then(response => response.data)
  },
}
