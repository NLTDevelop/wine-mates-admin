import { useCallback, useMemo } from 'react'
import { Region } from '../entities/types/location-types'
import { useRegionsQuery } from './useLocation'

interface UseRegionOptionsProps {
  countryId?: number | null
  cachedRegions?: Region[]
}

export const useRegionOptions = ({ countryId, cachedRegions = [] }: UseRegionOptionsProps) => {
  const { data: fetchedRegions, isLoading } = useRegionsQuery(countryId)

  const regions = useMemo(() => {
    if (!fetchedRegions) {
      return cachedRegions.filter(region => !countryId || region.countryId === countryId)
    }
    return fetchedRegions
  }, [fetchedRegions, cachedRegions, countryId])

  const fetchOptions = useCallback(
    async (search?: string) => {
      if (!countryId) {
        return []
      }

      const options = regions.map(region => ({
        value: region.id.toString(),
        label: region.name,
      }))

      if (search && search.trim()) {
        const term = search.toLowerCase()
        return options.filter(opt => opt.label.toLowerCase().includes(term))
      }

      return options
    },
    [countryId, regions]
  )

  return {
    fetchOptions,
    isLoading,
    regions,
  }
}
