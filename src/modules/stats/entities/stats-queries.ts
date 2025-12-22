import { statsService } from './stats-service'
import { StatsFilters } from './types'

export const statsQueries = {
  list: (filters: StatsFilters) => ({
    queryKey: ['stats', 'list'],
    queryFn: () => statsService.list(filters),
  }),
  summary: () => ({
    queryKey: ['stats', 'summary'],
    queryFn: () => statsService.summary(),
  }),
}
