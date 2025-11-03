import { colorService } from './color-service'
import { CreateWineColorParams, UpdateWineColorParams } from './types/color'

export const colorQueries = {
  list: () => ({
    queryKey: ['colors', 'list'],
    queryFn: () => colorService.list(),
  }),

  create: () => ({
    mutationKey: ['colors', 'create'],
    mutationFn: (color: CreateWineColorParams) => colorService.create(color),
  }),

  update: () => ({
    mutationKey: ['colors', 'update'],
    mutationFn: (params: UpdateWineColorParams) => colorService.update(params),
  }),

  delete: () => ({
    mutationKey: ['colors', 'delete'],
    mutationFn: (colorId: string) => colorService.delete(colorId),
  }),

  listShades: (colorId?: string) => ({
    queryKey: colorId ? ['colors', colorId, 'shades'] : ['shades', 'list'],
    queryFn: () => colorService.listShades(colorId),
  }),

  createShade: () => ({
    mutationKey: ['shades', 'create'],
    mutationFn: ({ colorId, shade }: { colorId: string; shade: CreateWineColorParams }) => colorService.createShade(colorId, shade),
  }),
}
