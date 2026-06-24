import { api } from '@/services'
import { ReorderParams } from './types'
import { REORDER_ENDPOINTS } from './endpoints'

export const reorderService = {
  reorder: (params: ReorderParams): Promise<void> => api.post(REORDER_ENDPOINTS.REORDER, params).then(response => response.data),
}
