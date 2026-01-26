import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_TYPE_ENDPOINTS } from './wine-type-endpoints'
import { WineType, UpdateWineTypeParams, CreateWineTypeRequest } from './types/wine-type'
import { ReorderItem } from '../../general/entities/types'

export const wineTypeService = {
  list: (): Promise<WineType[]> => api.get(WINE_TYPE_ENDPOINTS.LIST).then(response => response.data),

  create: (wineType: CreateWineTypeRequest): Promise<WineType> => api.post(WINE_TYPE_ENDPOINTS.CREATE, wineType).then(response => response.data),

  update: (params: UpdateWineTypeParams): Promise<WineType> =>
    api.patch(buildUrl(WINE_TYPE_ENDPOINTS.UPDATE, { wineTypeValue: params.wineTypeId }), params.newWineType).then(response => response.data),

  delete: (wineTypeValue: string): Promise<void> => api.delete(buildUrl(WINE_TYPE_ENDPOINTS.DELETE, { wineTypeValue })).then(response => response.data),

  reorder: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(WINE_TYPE_ENDPOINTS.REORDER), params).then(response => response.data),
}
