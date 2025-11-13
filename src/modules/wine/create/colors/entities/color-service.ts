import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { COLOR_CRUD_ENDPOINTS } from './colors-endpoints'
import { CreateShadesParams, CreateWineColorParams, /*ReorderShadesParams,*/ UpdateWineColorParams, WineShades } from './types/color-types'
import { WineColorGroup } from './types/color-types'

export const colorService = {
  list: (): Promise<WineColorGroup[]> => api.get(COLOR_CRUD_ENDPOINTS.COLORS.LIST).then(response => response.data),

  create: (color: CreateWineColorParams): Promise<WineColorGroup> => api.post(COLOR_CRUD_ENDPOINTS.COLORS.CREATE, color).then(response => response.data),

  update: (params: UpdateWineColorParams): Promise<WineColorGroup> =>
    api.patch(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.UPDATE, { colorId: params.colorId }), params.newColor).then(response => response.data),

  delete: (colorId: string): Promise<void> => api.delete(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.DELETE, { colorId })).then(response => response.data),

  createShade: (colorId: string, shadeData: CreateShadesParams): Promise<WineShades> => {
    return fetch(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorId, ...shadeData }),
    }).then(res => res.json())
  },

  updateShade: (colorId: string, shadeId: string, newShades: CreateShadesParams): Promise<WineShades> => {
    return fetch(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.UPDATE.replace(':id', shadeId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorId, ...newShades }),
    }).then(res => res.json())
  },

  deleteShade: (colorId: string): Promise<void> => api.delete(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.DELETE, { id: colorId })).then(response => response.data),

  // reorderShades: (params: ReorderShadesParams): Promise<void> =>
  //   api.post(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.REORDER, { colorId: params.colorId }), { shades: params.shades }).then(response => response.data),
}
