import { WineFilters } from '@/modules/wine/list/entities/types/types'
import { analysisService } from './analysis-service'
import { DetailFilters } from '../detail/entities/chemical_types'

export const analysisQueries = {
  list: (filters: WineFilters) => ({
    queryKey: ['analysis', 'list', filters],
    queryFn: () => analysisService.list(filters),
  }),

  detail: (wineId: string | number, filters: DetailFilters) => ({
    queryKey: ['analysis', 'detail', filters, wineId],
    queryFn: () => {
      const params: any = {}

      if (filters.range === 'day') {
        params.date = filters.value
      } else {
        params.range = filters.range
        params.period = filters.value
      }

      return analysisService.detail(wineId, params)
    },
    enabled: !!wineId,
  }),
}
