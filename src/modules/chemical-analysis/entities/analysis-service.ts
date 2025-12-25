import { ReviewFilters, ReviewsResponse, WineFilters } from '@/modules/wine/list/entities/types/types'
import { WineForAnalysisResponse } from '../list/entities/types'
import { api } from '@/services'
import { ANALYSIS_ENDPOINTS } from './analysis-endpoints'
import { IWineAnalysisDetail } from '../detail/entities/types'
import { buildUrl } from '@/lib/utils'

export const analysisService = {
  list: (filters: WineFilters): Promise<WineForAnalysisResponse> => api.get(ANALYSIS_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  detail: (wineId: string | number): Promise<IWineAnalysisDetail> => api.get(buildUrl(ANALYSIS_ENDPOINTS.DETAIL, { id: wineId })),

  reviews: (filters: ReviewFilters): Promise<ReviewsResponse> => api.get(ANALYSIS_ENDPOINTS.REVIEW, { params: filters }).then(response => response.data),
}
