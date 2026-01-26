import { ReorderItem } from '../../general/entities/types'
import { CreateWineTasteCharacteristicRequest, UpdateWineTasteCharacteristicParams } from './taste-characteristics'
import { tasteCharacteristicsService } from './taste-characteristics-service'

export const tasteCharacteristicsQueries = {
  list: () => ({
    queryKey: ['taste-characteristics', 'list'],
    queryFn: () => tasteCharacteristicsService.list(),
  }),

  create: () => ({
    mutationKey: ['taste-characteristics', 'create'],
    mutationFn: (characteristic: CreateWineTasteCharacteristicRequest) => tasteCharacteristicsService.create(characteristic),
  }),

  update: () => ({
    mutationKey: ['taste-characteristics', 'update'],
    mutationFn: (params: UpdateWineTasteCharacteristicParams) => tasteCharacteristicsService.update(params),
  }),

  delete: () => ({
    mutationKey: ['taste-characteristics', 'delete'],
    mutationFn: (characteristicId: string) => tasteCharacteristicsService.delete(characteristicId),
  }),

  reorder: () => ({
    mutationKey: ['taste-characteristics', 'reorder'],
    mutationFn: (params: ReorderItem[]) => tasteCharacteristicsService.reorder(params),
  }),

  reorderLevel: () => ({
    mutationKey: ['taste-characteristics-level', 'reorderLevels'],
    mutationFn: (params: ReorderItem[]) => tasteCharacteristicsService.reorderLevers(params),
  }),
}
