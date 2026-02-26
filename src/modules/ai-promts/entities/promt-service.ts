import { api } from '@/services'
import { GeminiFeatureConfig, GeminiUpdateConfig, OpenAIFeatureConfig, OpenAIUpdateConfig } from './types'
import { PROMT_ENDPOINTS } from './promt-endpoints'

export const promtService = {
  snacks: {
    list: (): Promise<OpenAIFeatureConfig> => api.get(PROMT_ENDPOINTS.SNACK.LIST).then(response => response.data),
    update: (params: OpenAIUpdateConfig): Promise<OpenAIFeatureConfig> => api.patch(PROMT_ENDPOINTS.SNACK.UPDATE, params).then(response => response.data),
    reset: (): Promise<OpenAIFeatureConfig> => api.post(PROMT_ENDPOINTS.SNACK.RESET).then(response => response.data),
  },
  tasting_note: {
    list: (): Promise<OpenAIFeatureConfig> => api.get(PROMT_ENDPOINTS.TASTING.LIST).then(response => response.data),
    update: (params: OpenAIUpdateConfig): Promise<OpenAIFeatureConfig> => api.patch(PROMT_ENDPOINTS.TASTING.UPDATE, params).then(response => response.data),
    reset: (): Promise<OpenAIFeatureConfig> => api.post(PROMT_ENDPOINTS.TASTING.RESET).then(response => response.data),
  },
  scanner: {
    list: (): Promise<GeminiFeatureConfig> => api.get(PROMT_ENDPOINTS.SCANNER.LIST).then(response => response.data),
    update: (params: GeminiUpdateConfig): Promise<GeminiFeatureConfig> => api.patch(PROMT_ENDPOINTS.SCANNER.UPDATE, params).then(response => response.data),
    reset: (): Promise<GeminiFeatureConfig> => api.post(PROMT_ENDPOINTS.SCANNER.RESET).then(response => response.data),
  },
}
