import { COLOR_CRUD_ENDPOINTS } from './colors-endpoints'
import { CreateShadesParams, CreateWineColorParams, UpdateShadesParams, UpdateWineColorParams } from './types/color-types'

export const wineColorQueries = {
  listGroups: (include?: string[]) => ({
    queryKey: ['color-groups', 'list', ...(include || [])],
    queryFn: async () => {
      const url = new URL(COLOR_CRUD_ENDPOINTS.COLORS.LIST)
      if (include && include.length > 0) {
        url.searchParams.set('include', include.join(','))
      }

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch color groups')
      return response.json()
    },
  }),

  createGroup: () => ({
    mutationKey: ['color-groups', 'create'],
    mutationFn: async (groupData: CreateWineColorParams) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLORS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      })
      if (!response.ok) throw new Error('Failed to create color group')
      return response.json()
    },
  }),

  updateGroup: () => ({
    mutationKey: ['color-groups', 'update'],
    mutationFn: async (params: UpdateWineColorParams) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLORS.UPDATE.replace(':colorId', params.colorId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.newColor),
      })
      if (!response.ok) throw new Error('Failed to update color group')
      return response.json()
    },
  }),

  deleteGroup: () => ({
    mutationKey: ['color-groups', 'delete'],
    mutationFn: async (groupId: string) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLORS.DELETE.replace(':colorId', groupId), {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete color group')
      return response.json()
    },
  }),

  createShade: () => ({
    mutationKey: ['color-shades', 'create'],
    mutationFn: async (params: CreateShadesParams & { groupId: string }) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (!response.ok) throw new Error('Failed to create shade')
      return response.json()
    },
  }),

  updateShade: () => ({
    mutationKey: ['color-shades', 'update'],
    mutationFn: async (params: UpdateShadesParams & { groupId: string }) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.UPDATE.replace(':id', params.shadeId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.newShades),
      })
      if (!response.ok) throw new Error('Failed to update shade')
      return response.json()
    },
  }),

  deleteShade: () => ({
    mutationKey: ['color-shades', 'delete'],
    mutationFn: async (shadeId: string) => {
      const response = await fetch(COLOR_CRUD_ENDPOINTS.COLOR_SHADES.DELETE.replace(':id', shadeId), {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete shade')
      return response.json()
    },
  }),
}
