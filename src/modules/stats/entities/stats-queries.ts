import { statsService } from './stats-service'
import { StatsFilters } from './types'

export const statsQueries = {
  list: (filters: StatsFilters) => ({
    queryKey: ['stats', 'list'],
    queryFn: () => statsService.list(filters),
  }),
  summary: (filters: StatsFilters) => ({
    queryKey: ['stats', 'summary', filters],
    queryFn: () => statsService.summary(filters),
  }),
  activity: (filters: StatsFilters) => ({
    queryKey: ['stats', 'activity', filters],
    queryFn: () => statsService.activity(filters),
  }),
}
