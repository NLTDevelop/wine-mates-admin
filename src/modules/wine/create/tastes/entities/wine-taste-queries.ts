import { FiltersParams, ReorderItem } from '../../general/entities/types'
import { CreateWineTasteRequest, UpdateWineTasteParams } from './types/tastes'
import { tasteService } from './wine-taste-service'

export const tasteQueries = {
  list: (filters: FiltersParams = {}) => ({
    queryKey: ['tastes', 'list', filters],
    queryFn: () => tasteService.list(filters),
  }),

  create: () => ({
    mutationKey: ['tastes', 'create'],
    mutationFn: (taste: CreateWineTasteRequest) => tasteService.create(taste),
  }),

  update: () => ({
    mutationKey: ['tastes', 'update'],
    mutationFn: (params: UpdateWineTasteParams) => tasteService.update(params),
  }),

  delete: () => ({
    mutationKey: ['tastes', 'delete'],
    mutationFn: (tasteId: string) => tasteService.delete(tasteId),
  }),

  reorder: () => ({
    mutationKey: ['tastes', 'reorder'],
    mutationFn: (params: ReorderItem[]) => tasteService.reorder(params),
  }),
}
