import { api } from '@/services'
import { Country, Region } from './types/location-types'

export const locationService = {
  getCountries: (search?: string): Promise<Country[]> => {
    const params = search ? { search } : {}
    return api.get('/v1/countries', { params }).then(response => response.data)
  },

  getRegions: (countryId: string | number, search?: string): Promise<Region[]> => {
    const params = search ? { search } : {}
    return api.get(`/v1/countries/${countryId}/regions`, { params }).then(response => response.data)
  },
}
