import { wineTypeService } from './wine-type-service'
import { CreateWineTypeRequest, UpdateWineTypeParams } from './types/wine-type'

export interface WineTypeFilters {
  search?: string
  limit?: number
  offset?: number
  include?: string[]
}

export const wineTypeQueries = {
  list: (filters: WineTypeFilters = {}) => ({
    queryKey: ['wine-types', 'list', filters],
    queryFn: () => wineTypeService.list(filters),
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
