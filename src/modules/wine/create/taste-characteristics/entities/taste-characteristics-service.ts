import { api } from '@/services'
import { buildUrl } from '@/lib/utils'

import { TASTE_CHARACTERISTICS_ENDPOINTS } from './taste-characteristics-endpoints'
import { WineTasteCharacteristics, CreateWineTasteCharacteristicParams, UpdateWineTasteCharacteristicParams, CreateWineTasteItemParams, UpdateWineTasteItemParams } from './types/taste-characteristics'

export const tasteCharacteristicsService = {
  listCharacteristics: (): Promise<WineTasteCharacteristics[]> => api.get(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTICS.LIST).then(response => response.data),

  createCharacteristic: (characteristic: CreateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> =>
    api.post(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTICS.CREATE, characteristic).then(response => response.data),

  updateCharacteristic: (params: UpdateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> =>
    api.put(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTICS.UPDATE, { characteristicId: params.characteristicId }), params.newCharacteristic).then(response => response.data),

  deleteCharacteristic: (characteristicId: string): Promise<void> => api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTICS.DELETE, { characteristicId })).then(response => response.data),

  listItems: (characteristicId?: string): Promise<WineTasteCharacteristics[]> => {
    const endpoint = characteristicId ? buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTIC_ITEMS.LIST, { characteristicId }) : TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.LIST
    return api.get(endpoint).then(response => response.data)
  },

  createItem: (characteristicId: string, item: CreateWineTasteItemParams): Promise<WineTasteCharacteristics> =>
    api.post(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.CHARACTERISTIC_ITEMS.CREATE, { characteristicId }), item).then(response => response.data),

  updateItem: (params: UpdateWineTasteItemParams): Promise<WineTasteCharacteristics> =>
    api.put(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.UPDATE, { itemId: params.itemId }), params.newItem).then(response => response.data),

  deleteItem: (params: { characteristicId: string; itemId: string }): Promise<void> =>
    api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.ITEMS.DELETE, { itemId: params.itemId })).then(response => response.data),
}
