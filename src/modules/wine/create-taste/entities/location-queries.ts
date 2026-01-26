import { locationService } from './location-service'

export const locationQueries = {
  countries: (search?: string) => ({
    queryKey: ['locations', 'countries', search],
    queryFn: () => locationService.getCountries(search),
    staleTime: 5 * 60 * 1000,
  }),

  regions: (countryId: string | number | null | undefined, search?: string) => ({
    queryKey: ['locations', 'regions', countryId, search],
    queryFn: () => {
      if (!countryId) throw new Error('Country ID is required')
      return locationService.getRegions(countryId, search)
    },
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
  }),
}
