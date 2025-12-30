import { WineFilters } from '@/modules/wine/list/entities/types/types'
import { WineForAnalysisResponse } from '../list/entities/types'
import { api } from '@/services'
import { ANALYSIS_ENDPOINTS } from './analysis-endpoints'
import { buildUrl } from '@/lib/utils'
import { WineAnalysisUIResponse } from '../detail/entities/chemical_types'

export const analysisService = {
  list: (filters: WineFilters): Promise<WineForAnalysisResponse> => api.get(ANALYSIS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  detail: (
    wineId: string | number,
    params: {
      date?: string
      range?: 'month' | 'year'
      period?: string
    }
  ): Promise<WineAnalysisUIResponse> => api.get(buildUrl(ANALYSIS_ENDPOINTS.DETAIL, { id: wineId }), { params }),
}
