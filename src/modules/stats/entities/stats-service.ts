import { api } from '@/services'
import { StatsFilters, StatsTableResponse, StatsResponse, IOverallStats } from './types'
import { STATS_ENDPOINTS } from './stats-endpoints'

export const statsService = {
  list: (filters: StatsFilters): Promise<StatsTableResponse> => api.get(STATS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  summary: (filters: StatsFilters): Promise<IOverallStats> => api.get(STATS_ENDPOINTS.SUMMARY, { params: filters }).then(response => response.data),

  activity: (filters: StatsFilters): Promise<StatsResponse[]> => api.get(STATS_ENDPOINTS.ACTIVITY, { params: filters }).then(response => response.data),
}
