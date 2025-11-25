import { api } from '@/services'
import { buildUrl } from '@/lib/utils'

import { TASTE_CHARACTERISTICS_ENDPOINTS } from './taste-characteristics-endpoints'
import { CreateWineTasteCharacteristicRequest, ReorderLevelParams, UpdateWineTasteCharacteristicParams, WineTasteCharacteristics } from './taste-characteristics'

export const tasteCharacteristicsService = {
  list: (include?: string[]): Promise<WineTasteCharacteristics[]> =>
    api
      .get(TASTE_CHARACTERISTICS_ENDPOINTS.LIST, {
        params: include && include.length > 0 ? { include } : {},
      })
      .then(response => response.data),

  create: (characteristic: CreateWineTasteCharacteristicRequest): Promise<WineTasteCharacteristics> => api.post(TASTE_CHARACTERISTICS_ENDPOINTS.CREATE, characteristic).then(response => response.data),

  update: (params: UpdateWineTasteCharacteristicParams): Promise<WineTasteCharacteristics> =>
    api.put(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.UPDATE, { characteristicId: params.characteristicId }), params.newCharacteristic).then(response => response.data),

  delete: (characteristicId: string): Promise<void> => api.delete(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.DELETE, { characteristicId })).then(response => response.data),

  reorderLevers: (params: ReorderLevelParams): Promise<void> =>
    api.patch(buildUrl(TASTE_CHARACTERISTICS_ENDPOINTS.REORDER_LEVEL, { id: params.characteristicId }), { levelIds: params.levelIds }).then(response => response.data),
}
