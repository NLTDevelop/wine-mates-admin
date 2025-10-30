import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_TYPE_ENDPOINTS } from './wine-type-endpoints'
import { WineType, CreateWineTypeParams, UpdateWineTypeParams } from './types/wine-type'

export const wineTypeService = {
  list: (): Promise<WineType[]> => api.get(WINE_TYPE_ENDPOINTS.LIST).then(response => response.data),

  create: (wineType: CreateWineTypeParams): Promise<WineType> => api.post(WINE_TYPE_ENDPOINTS.CREATE, wineType).then(response => response.data),

  update: (params: UpdateWineTypeParams): Promise<WineType> => api.put(buildUrl(WINE_TYPE_ENDPOINTS.UPDATE, { wineTypeValue: params.oldValue }), params.newWineType).then(response => response.data),

  delete: (wineTypeValue: string): Promise<void> => api.delete(buildUrl(WINE_TYPE_ENDPOINTS.DELETE, { wineTypeValue })).then(response => response.data),
}
