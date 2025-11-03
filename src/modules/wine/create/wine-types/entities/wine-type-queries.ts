import { wineTypeService } from './wine-type-service'
import { CreateWineTypeParams, UpdateWineTypeParams } from './types/wine-type'

export const wineTypeQueries = {
  list: () => ({
    queryKey: ['wine-types', 'list'],
    queryFn: () => wineTypeService.list(),
  }),

  create: () => ({
    mutationKey: ['wine-types', 'create'],
    mutationFn: (wineType: CreateWineTypeParams) => wineTypeService.create(wineType),
  }),

  update: () => ({
    mutationKey: ['wine-types', 'update'],
    mutationFn: (params: UpdateWineTypeParams) => wineTypeService.update(params),
  }),

  delete: () => ({
    mutationKey: ['wine-types', 'delete'],
    mutationFn: (wineTypeValue: string) => wineTypeService.delete(wineTypeValue),
  }),
}
