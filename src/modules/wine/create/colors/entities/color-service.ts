import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { COLOR_CRUD_ENDPOINTS } from './colors-endpoints'
import { CreateShadesParams, CreateWineColorParams, UpdateWineColorParams, WineColorGroup } from './types/color-types'
import { DataResponse, FiltersParams, ReorderItem } from '../../general/entities/types'

export const colorService = {
  list: (filters: FiltersParams = {}): Promise<DataResponse<WineColorGroup>> => {
    const params: any = { ...filters }

    if (filters.include && filters.include.length > 0) {
      params.include = filters.include
    }

    return api.get(COLOR_CRUD_ENDPOINTS.COLORS.LIST, { params }).then(response => response.data)
  },

  create: (group: CreateWineColorParams): Promise<WineColorGroup> => {
    return api.post(COLOR_CRUD_ENDPOINTS.COLORS.CREATE, group).then(response => response.data)
  },

  update: (params: UpdateWineColorParams): Promise<WineColorGroup> => {
    return api.patch(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.UPDATE, { id: params.colorId }), params.newColor).then(response => response.data)
  },

  delete: (groupId: string): Promise<void> => {
    return api.delete(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.DELETE, { id: groupId })).then(response => response.data)
  },

  createShade: (groupId: string, shadeData: CreateShadesParams): Promise<any> => {
    const data = {
      colorId: groupId,
      ...shadeData,
    }
    return api.post(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.CREATE, data).then(response => response.data)
  },

  updateShade: (groupId: string, shadeId: string, newShades: CreateShadesParams): Promise<any> => {
    const data = {
      colorId: groupId,
      ...newShades,
    }
    return api.patch(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.UPDATE, { id: shadeId }), data).then(response => response.data)
  },

  deleteShade: (shadeId: string): Promise<void> => {
    return api.delete(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.DELETE, { id: shadeId })).then(response => response.data)
  },

  reorderGroup: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(COLOR_CRUD_ENDPOINTS.COLORS.REORDER), params).then(response => response.data),

  reorderShades: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.REORDER), params).then(response => response.data),
}
