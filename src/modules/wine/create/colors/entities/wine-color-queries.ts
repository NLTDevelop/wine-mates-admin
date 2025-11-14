import { CreateShadesParams, CreateWineColorParams, UpdateWineColorParams } from './types/color-types'
import { colorService } from './color-service'

export const wineColorQueries = {
  listGroups: (include?: string[]) => ({
    queryKey: ['color-groups', 'list', ...(include || [])],
    queryFn: () => colorService.list(include),
  }),

  createGroup: () => ({
    mutationKey: ['color-groups', 'create'],
    mutationFn: (group: CreateWineColorParams) => colorService.create(group),
  }),

  updateGroup: () => ({
    mutationKey: ['color-groups', 'update'],
    mutationFn: (params: UpdateWineColorParams) => colorService.update(params),
  }),

  deleteGroup: () => ({
    mutationKey: ['color-groups', 'delete'],
    mutationFn: (groupId: string) => colorService.delete(groupId),
  }),

  createShade: () => ({
    mutationKey: ['color-shades', 'create'],
    mutationFn: (params: { groupId: string; shadeData: CreateShadesParams }) => colorService.createShade(params.groupId, params.shadeData),
  }),

  updateShade: () => ({
    mutationKey: ['color-shades', 'update'],
    mutationFn: (params: { groupId: string; shadeId: string; newShades: CreateShadesParams }) => colorService.updateShade(params.groupId, params.shadeId, params.newShades),
  }),

  deleteShade: () => ({
    mutationKey: ['color-shades', 'delete'],
    mutationFn: (shadeId: string) => colorService.deleteShade(shadeId),
  }),
}
