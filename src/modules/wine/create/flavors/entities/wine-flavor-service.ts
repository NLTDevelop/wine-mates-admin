import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AROMA_CRUD_ENDPOINTS } from './wine-flavor-endpoints'
import {
  CreateWineAromaGroupParams,
  CreateWineAromaItemParams,
  CreateWineAromaSubgroupParams,
  UpdateWineAromaGroupParams,
  UpdateWineAromaSubgroupParams,
  WineAromaGroup,
  WineAromaItem,
  WineAromaSubgroup,
} from './types/flavor-types'

export const wineFlavorService = {
  listGroups: (): Promise<WineAromaGroup[]> => api.get(AROMA_CRUD_ENDPOINTS.GROUP.LIST).then(response => response.data),

  createGroup: (group: CreateWineAromaGroupParams): Promise<WineAromaGroup> => api.post(AROMA_CRUD_ENDPOINTS.GROUP.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateWineAromaGroupParams): Promise<WineAromaGroup> =>
    api.put(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.UPDATE, { id: params.groupId }), params.newGroup).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.DELETE, { id: groupId })).then(response => response.data),

  createSubgroup: (subgroup: CreateWineAromaSubgroupParams): Promise<WineAromaSubgroup> => api.post(AROMA_CRUD_ENDPOINTS.SUBGROUP.CREATE, subgroup).then(response => response.data),

  updateSubgroup: (params: UpdateWineAromaSubgroupParams): Promise<WineAromaSubgroup> =>
    api.put(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.UPDATE, { id: params.subgroupId }), params.newSubgroup).then(response => response.data),

  deleteSubgroup: (subgroupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.DELETE, { id: subgroupId })).then(response => response.data),

  createAroma: (aroma: CreateWineAromaItemParams): Promise<WineAromaItem> => api.post(AROMA_CRUD_ENDPOINTS.AROMA.CREATE, aroma).then(response => response.data),

  updateAroma: (params: { aromaId: string; newAroma: CreateWineAromaItemParams }): Promise<WineAromaItem> =>
    api.put(buildUrl(AROMA_CRUD_ENDPOINTS.AROMA.UPDATE, { id: params.aromaId }), params.newAroma).then(response => response.data),

  deleteAroma: (aromaId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.AROMA.DELETE, { id: aromaId })).then(response => response.data),
}
