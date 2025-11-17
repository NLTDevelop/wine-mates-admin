import { wineTypeService } from './wine-type-service'
import { CreateWineTypeRequest, UpdateWineTypeParams } from './types/wine-type'
import { FiltersParams } from '../../general/entities/types'



export const wineTypeQueries = {
  list: (include?: string[]) => ({
    queryKey: ['wine-types', 'list', ...(include || [])],
    queryFn: () => wineTypeService.list(include),
  }),

  create: () => ({
    mutationKey: ['wine-types', 'create'],
    mutationFn: (wineType: CreateWineTypeRequest) => wineTypeService.create(wineType),
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
