import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { FEATURE_ENDPOINTS } from './feature-endpoints'
import { Feature, UpdateFeatureParams } from './types'

export const featureService = {
  list: (): Promise<Feature[]> => api.get(FEATURE_ENDPOINTS.LIST).then(response => response.data),

  updateToggle: ({ key, isEnabled }: UpdateFeatureParams): Promise<Feature> => api.patch(buildUrl(FEATURE_ENDPOINTS.UPDATE, { key }), { isEnabled }).then(response => response.data),
}
