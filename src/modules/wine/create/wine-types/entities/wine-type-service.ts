import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WINE_TYPE_ENDPOINTS } from './wine-type-endpoints'
import { WineType, UpdateWineTypeParams, CreateWineTypeRequest } from './types/wine-type'

export const wineTypeService = {
  list: (include?: string[]) :Promise<WineType[]>=>
    api
      .get(WINE_TYPE_ENDPOINTS.LIST, {
        params: include && include.length > 0 ? { include } : {},
      })
      .then(response => response.data),

  create: (wineType: CreateWineTypeRequest): Promise<WineType> => api.post(WINE_TYPE_ENDPOINTS.CREATE, wineType).then(response => response.data),

  update: (params: UpdateWineTypeParams): Promise<WineType> =>
    api.patch(buildUrl(WINE_TYPE_ENDPOINTS.UPDATE, { wineTypeValue: params.wineTypeId }), params.newWineType).then(response => response.data),

  delete: (wineTypeValue: string): Promise<void> => api.delete(buildUrl(WINE_TYPE_ENDPOINTS.DELETE, { wineTypeValue })).then(response => response.data),
}
