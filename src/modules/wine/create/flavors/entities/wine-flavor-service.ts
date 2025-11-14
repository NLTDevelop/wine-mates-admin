import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AROMA_CRUD_ENDPOINTS } from './wine-flavor-endpoints'
import { CreateWineAromaGroupParams, CreateWineAromaSubgroupParams, UpdateWineAromaGroupParams, UpdateWineAromaSubgroupParams, WineAromaGroup, WineAromaSubgroup } from './types/flavor-types'

export const wineFlavorService = {
  listGroups: (include?: string[]) =>
    api
      .get(AROMA_CRUD_ENDPOINTS.GROUP.LIST, {
        params: include && include.length > 0 ? { include } : {},
      })
      .then(response => response.data),

  createGroup: (group: CreateWineAromaGroupParams): Promise<WineAromaGroup> => api.post(AROMA_CRUD_ENDPOINTS.GROUP.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateWineAromaGroupParams): Promise<WineAromaGroup> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.UPDATE, { id: params.groupId }), params.newGroup).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.DELETE, { id: groupId })).then(response => response.data),

  createSubgroup: (subgroup: CreateWineAromaSubgroupParams): Promise<WineAromaSubgroup> => api.post(AROMA_CRUD_ENDPOINTS.SUBGROUP.CREATE, subgroup).then(response => response.data),

  updateSubgroup: (params: UpdateWineAromaSubgroupParams): Promise<WineAromaSubgroup> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.UPDATE, { id: params.subgroupId }), params.newSubgroup).then(response => response.data),

  deleteSubgroup: (subgroupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.DELETE, { id: subgroupId })).then(response => response.data),
}
