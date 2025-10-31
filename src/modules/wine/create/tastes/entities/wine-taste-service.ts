import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { TASTE_ENDPOINTS } from './wine-tastes-endpoints'
import { CreateWineTasteParams, UpdateWineTasteParams, WineTaste } from './types/tastes'

export const tasteService = {
  list: (): Promise<WineTaste[]> => api.get(TASTE_ENDPOINTS.LIST).then(response => response.data),

  create: (taste: CreateWineTasteParams): Promise<WineTaste> => api.post(TASTE_ENDPOINTS.CREATE, taste).then(response => response.data),

  update: (params: UpdateWineTasteParams): Promise<WineTaste> => api.put(buildUrl(TASTE_ENDPOINTS.UPDATE, { tasteId: params.tasteId }), params.newTaste).then(response => response.data),

  delete: (tasteId: string): Promise<void> => api.delete(buildUrl(TASTE_ENDPOINTS.DELETE, { tasteId })).then(response => response.data),
}
