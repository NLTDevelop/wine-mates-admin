import { api } from '@/services'
import { CharacteristicsHistoryResponse, TasteHistoryResponse } from './types'
import { ANALYSIS_HISTORY_ENDPOINTS } from './analysis-detail-endpoint'
import { buildUrlWithDate } from '@/lib/utils'

export const analysisHistoryService = {
  characteristics: (wineId: string | number, date: string): Promise<CharacteristicsHistoryResponse> => api.get(buildUrlWithDate(ANALYSIS_HISTORY_ENDPOINTS.CHARACTERISTICS, { id: wineId, date })),

  taste: (wineId: string | number, date: string): Promise<TasteHistoryResponse> => api.get(buildUrlWithDate(ANALYSIS_HISTORY_ENDPOINTS.TASTE, { id: wineId, date })),
}
