import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { TASTE_ENDPOINTS } from './wine-tastes-endpoints'
import { CreateWineTasteRequest, UpdateWineTasteParams, WineTaste } from './types/tastes'
import { DataResponse, FiltersParams } from '../../general/entities/types'

export const tasteService = {
  list: (filters: FiltersParams = {}): Promise<DataResponse<WineTaste>> => {
    const params: any = { ...filters }

    if (filters.include && filters.include.length > 0) {
      params.include = filters.include
    }

    return api.get(TASTE_ENDPOINTS.LIST, { params }).then(response => response.data)
  },

  create: (taste: CreateWineTasteRequest): Promise<WineTaste> => api.post(TASTE_ENDPOINTS.CREATE, taste).then(response => response.data),

  update: (params: UpdateWineTasteParams): Promise<WineTaste> => api.patch(buildUrl(TASTE_ENDPOINTS.UPDATE, { tasteId: params.tasteId }), params.newTaste).then(response => response.data),

  delete: (tasteId: string): Promise<void> => api.delete(buildUrl(TASTE_ENDPOINTS.DELETE, { tasteId })).then(response => response.data),
}
