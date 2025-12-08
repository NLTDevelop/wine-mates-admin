import { api } from '@/services'
import { WineOption } from './types/wine-type'

export const wineOptionsService = {
  getColors: (search?: string): Promise<WineOption[]> => api.get('/v1/admin/wine-colors', { params: { search } }).then(response => response.data),
  getTypes: (search?: string): Promise<WineOption[]> => api.get('/v1/admin/wine-types', { params: { search } }).then(response => response.data),
}
