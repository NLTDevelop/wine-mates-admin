import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { COLOR_CRUD_ENDPOINTS } from './colors-endpoints'
import { CreateWineColorParams, CreateWineItemParams, ReorderShadesParams, UpdateWineColorParams, UpdateWineItemParams, WineColor, WineColorItem } from './types/color'

export const colorService = {
  list: (): Promise<WineColor[]> => api.get(COLOR_CRUD_ENDPOINTS.COLORS.LIST).then(response => response.data),

  create: (color: CreateWineColorParams): Promise<WineColor> => api.post(COLOR_CRUD_ENDPOINTS.COLORS.CREATE, color).then(response => response.data),

  update: (params: UpdateWineColorParams): Promise<WineColor> => api.put(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.UPDATE, { colorId: params.colorId }), params.newColor).then(response => response.data),

  delete: (colorId: string): Promise<void> => api.delete(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.DELETE, { colorId })).then(response => response.data),

  listShades: (colorId?: string): Promise<WineColor[]> => {
    const endpoint = colorId ? buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.LIST, { colorId }) : COLOR_CRUD_ENDPOINTS.SHADES.LIST
    return api.get(endpoint).then(response => response.data)
  },

  createShade: (colorId: string, item: CreateWineItemParams): Promise<WineColorItem> => api.post(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.CREATE, { colorId }), item).then(response => response.data),

  updateShade: (colorId: string, item: UpdateWineItemParams): Promise<WineColorItem> =>
    api.put(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.UPDATE, { colorId, itemId: item.itemId }), item).then(response => response.data),

  reorderShades: (params: ReorderShadesParams): Promise<void> =>
    api.post(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.REORDER, { colorId: params.colorId }), { shades: params.shades }).then(response => response.data),
}
