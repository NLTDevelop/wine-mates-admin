import { CreateWineTasteCharacteristicParams, CreateWineTasteItemParams, LevelItem, UpdateWineTasteCharacteristicParams } from './types/taste-characteristics'
import { tasteCharacteristicsService } from './taste-characteristics-service'

export const tasteCharacteristicsQueries = {
  listCharacteristics: () => ({
    queryKey: ['taste-characteristics', 'list'],
    queryFn: () => tasteCharacteristicsService.listCharacteristics(),
  }),

  createCharacteristic: () => ({
    mutationKey: ['taste-characteristics', 'create'],
    mutationFn: (characteristic: CreateWineTasteCharacteristicParams) => tasteCharacteristicsService.createCharacteristic(characteristic),
  }),

  updateCharacteristic: () => ({
    mutationKey: ['taste-characteristics', 'update'],
    mutationFn: (params: UpdateWineTasteCharacteristicParams) => tasteCharacteristicsService.updateCharacteristic(params),
  }),

  deleteCharacteristic: () => ({
    mutationKey: ['taste-characteristics', 'delete'],
    mutationFn: (characteristicId: string) => tasteCharacteristicsService.deleteCharacteristic(characteristicId),
  }),

  listItems: (characteristicId?: string) => ({
    queryKey: characteristicId ? ['taste-characteristics', characteristicId, 'items'] : ['taste-items', 'list'],
    queryFn: () => tasteCharacteristicsService.listItems(characteristicId),
  }),

  createItem: () => ({
    mutationKey: ['taste-items', 'create'],
    mutationFn: ({ characteristicId, item }: { characteristicId: string; item: CreateWineTasteItemParams & { level?: LevelItem[] } }) => tasteCharacteristicsService.createItem(characteristicId, item),
  }),

  updateItem: () => ({
    mutationKey: ['taste-items', 'update'],
    mutationFn: (params: { characteristicId: string; itemId: string; newItem: CreateWineTasteItemParams & { level?: LevelItem[] } }) => tasteCharacteristicsService.updateItem(params),
  }),

  deleteItem: () => ({
    mutationKey: ['taste-items', 'delete'],
    mutationFn: (params: { characteristicId: string; itemId: string }) => tasteCharacteristicsService.deleteItem(params),
  }),

  updateItemLevels: () => ({
    mutationKey: ['taste-items', 'update-levels'],
    mutationFn: async (params: { characteristicId: string; itemId: string; levels: LevelItem[] }) => {
      const currentItems = await tasteCharacteristicsService.listItems(params.characteristicId)
      const currentItem = currentItems.find(item => item.id === params.itemId)

      if (!currentItem) {
        throw new Error(`Item ${params.itemId} not found in characteristic ${params.characteristicId}`)
      }

      return tasteCharacteristicsService.updateItem({
        characteristicId: params.characteristicId,
        itemId: params.itemId,
        newItem: {
          name: currentItem.label,
          nameEn: currentItem.labelEn,
          level: params.levels,
        },
      })
    },
  }),
}
