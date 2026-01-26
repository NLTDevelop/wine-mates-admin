import { api } from '@/services'
import { buildUrl } from '@/lib/utils'

import { TASTE_CHARACTERISTICS_ENDPOINTS } from './taste-characteristics-endpoints'
import { CreateWineTasteCharacteristicRequest, UpdateWineTasteCharacteristicParams, WineTasteCharacteristics } from './taste-characteristics'
import { ReorderItem } from '../../general/entities/types'

export const tasteCharacteristicsService = {
  list: (): Promise<WineTasteCharacteristics[]> => api.get(TASTE_CHARACTERISTICS_ENDPOINTS.LIST).then(response => response.data),

  create: (characteristic: CreateWineTasteCharacteristicRequest): Promise<WineTasteCharacteristics> => api.post(TASTE_CHARACTERISTICS_ENDPOINTS.CREATE, characteristic).then(response => response.data),

  update: (params: UpdateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> =>
    api.patch(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.UPDATE, { characteristicId: params.characteristicId }), params.newCharacteristic).then(response => response.data),

  delete: (characteristicId: string): Promise<void> => api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.DELETE, { characteristicId })).then(response => response.data),

  reorder: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.REORDER), params).then(response => response.data),

  reorderLevers: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.REORDER_LEVEL), params).then(response => response.data),
}
