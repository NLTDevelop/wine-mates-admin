import { ReviewFilters, WineFilters } from '@/modules/wine/list/entities/types/types'
import { analysisService } from './analysis-service'

export const analysisQueries = {
  list: (filters: WineFilters) => ({
    queryKey: ['analysis', 'list', filters],
    queryFn: () => analysisService.list(filters),
  }),

  detail: (wineId: string | number) => ({
    queryKey: ['analysis', 'detail'],
    queryFn: () => analysisService.detail(wineId),
    enabled: !!wineId,
  }),

  reviews: (filters: ReviewFilters) => ({
    queryKey: ['analysis', 'reviews', filters],
    queryFn: () => analysisService.reviews(filters),
  }),
}
