import { api } from '@/services'
import { buildUrl } from '@/lib/utils'

import { TASTE_CHARACTERISTICS_ENDPOINTS } from './taste-characteristics-endpoints'
import {
  WineTasteCharacteristics,
  CreateWineTasteCharacteristicParams,
  UpdateWineTasteCharacteristicParams,
  // CreateWineTasteItemParams,
  // UpdateWineTasteItemParams,
  // LevelItem,
} from './types/taste-characteristics'

export const tasteCharacteristicsService = {
  list: (include?: string[]): Promise<WineTasteCharacteristics[]> =>
    api
      .get(TASTE_CHARACTERISTICS_ENDPOINTS.LIST, {
        params: include && include.length > 0 ? { include } : {},
      })
      .then(response => response.data),

  create: (characteristic: CreateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> => api.post(TASTE_CHARACTERISTICS_ENDPOINTS.CREATE, characteristic).then(response => response.data),

  update: (params: UpdateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> =>
    api.put(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.UPDATE, { characteristicId: params.characteristicId }), params.newCharacteristic).then(response => response.data),

  delete: (characteristicId: string): Promise<void> => api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.DELETE, { characteristicId })).then(response => response.data),

  // listItems: (characteristicId?: string): Promise<WineTasteCharacteristics[]> => {
  //   const endpoint = characteristicId ? buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTIC_ITEMS.LIST, { characteristicId }) : TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.LIST
  //   return api.get(endpoint).then(response => response.data)
  // },

  // createItem: (characteristicId: string, item: CreateWineTasteItemParams): Promise<WineTasteCharacteristics> =>
  //   api.post(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTIC_ITEMS.CREATE, { characteristicId }), item).then(response => response.data),

  // updateItem: (params: UpdateWineTasteItemParams): Promise<WineTasteCharacteristics> =>
  //   api.put(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.UPDATE, { itemId: params.itemId }), params.newItem).then(response => response.data),

  // deleteItem: (params: { characteristicId: string; itemId: string }): Promise<void> =>
  //   api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.DELETE, { itemId: params.itemId })).then(response => response.data),

  // updateLevelName: async (characteristicId: string, levelId: string, levelName: string) => {
  //   const response = await api.patch(TASTE_CHARACTERISTICS_ENDPOINTS.LEVELS.UPDATE_LEVEL.replace(':characteristicId', characteristicId).replace(':levelId', levelId), { levelName })
  //   return response.data
  // },

  // updateLevelsOrder: async (characteristicId: string, levels: LevelItem[]) => {
  //   const response = await api.patch(TASTE_CHARACTERISTICS_ENDPOINTS.LEVELS.UPDATE_ORDER.replace(':characteristicId', characteristicId), { levels })
  //   return response.data
  // },
}
