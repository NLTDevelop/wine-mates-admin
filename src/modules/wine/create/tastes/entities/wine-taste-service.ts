import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { TASTE_ENDPOINTS } from './wine-tastes-endpoints'
import { CreateWineTasteParams, UpdateWineTasteParams, CreateWineTasteGroupRequest, UpdateWineTasteGroupParams, WineTasteGroup, WineTasteItem } from './types/tastes'
import { ReorderItem } from '../../general/entities/types'

export const tasteService = {
  listGroups: (): Promise<WineTasteGroup[]> => api.get(TASTE_ENDPOINTS.GROUP.LIST).then(response => response.data),

  createGroup: (group: CreateWineTasteGroupRequest): Promise<WineTasteGroup> => api.post(TASTE_ENDPOINTS.GROUP.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateWineTasteGroupParams): Promise<WineTasteGroup> =>
    api.patch(buildUrl(TASTE_ENDPOINTS.GROUP.UPDATE, { id: params.groupId }), params.newGroup).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(TASTE_ENDPOINTS.GROUP.DELETE, { id: groupId })).then(response => response.data),

  reorderGroup: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(TASTE_ENDPOINTS.GROUP.REORDER), params).then(response => response.data),

  createTaste: (tasteData: CreateWineTasteParams & { groupId: number }): Promise<WineTasteItem> => api.post(TASTE_ENDPOINTS.TASTES.CREATE, tasteData).then(response => response.data),

  updateTaste: (params: UpdateWineTasteParams): Promise<WineTasteItem> => api.patch(buildUrl(TASTE_ENDPOINTS.TASTES.UPDATE, { id: params.groupId }), params.newTaste).then(response => response.data),

  deleteTaste: (tasteId: string): Promise<void> => api.delete(buildUrl(TASTE_ENDPOINTS.TASTES.DELETE, { id: tasteId })).then(response => response.data),

  reorderTaste: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(TASTE_ENDPOINTS.TASTES.REORDER), params).then(response => response.data),
}
