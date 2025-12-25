import { api } from '@/services'
import { StatsFilters, StatsTableResponse, StatsResponse } from './types'
import { STATS_ENDPOINTS } from './stats-endpoints'

export const statsService = {
  list: (filters: StatsFilters): Promise<StatsTableResponse> => api.get(STATS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  summary: (): Promise<StatsResponse[]> => api.get(STATS_ENDPOINTS.SUMMARY).then(response => response.data),
}
