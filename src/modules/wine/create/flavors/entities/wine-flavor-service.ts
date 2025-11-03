import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AROMA_CRUD_ENDPOINTS } from './wine-flavor-endpoints'
import { WineAromaGroup, WineAromaItem, CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaItemParams } from './types/flavor'

export const wineFlavorService = {
  listGroups: (): Promise<WineAromaGroup[]> => api.get(AROMA_CRUD_ENDPOINTS.GROUPS.LIST).then(response => response.data),

  createGroup: (group: CreateWineAromaGroupParams): Promise<WineAromaGroup> => api.post(AROMA_CRUD_ENDPOINTS.GROUPS.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateWineAromaGroupParams): Promise<WineAromaGroup> =>
    api.put(buildUrl(AROMA_CRUD_ENDPOINTS.GROUPS.UPDATE, { groupId: params.groupId }), params.newGroup).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.GROUPS.DELETE, { groupId })).then(response => response.data),

  listItems: (groupId?: string): Promise<WineAromaItem[]> => {
    const endpoint = groupId ? buildUrl(AROMA_CRUD_ENDPOINTS.GROUP_ITEMS.LIST, { groupId }) : AROMA_CRUD_ENDPOINTS.ITEMS.LIST
    return api.get(endpoint).then(response => response.data)
  },

  createItem: (groupId: string, item: CreateWineAromaItemParams): Promise<WineAromaItem> =>
    api.post(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP_ITEMS.CREATE, { groupId }), item).then(response => response.data),

  updateItem: (params: { groupId: string; itemId: string; newItem: CreateWineAromaItemParams }): Promise<WineAromaItem> =>
    api.put(buildUrl(AROMA_CRUD_ENDPOINTS.ITEMS.UPDATE, { itemId: params.itemId }), params.newItem).then(response => response.data),

  deleteItem: (params: { groupId: string; itemId: string }): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.ITEMS.DELETE, { itemId: params.itemId })).then(response => response.data),
}
