import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { AROMA_CRUD_ENDPOINTS } from './wine-flavor-endpoints'
import {
  CreateWineAromaGroupRequest,
  CreateWineAromaSubgroupParams,
  ReorderAromasParams,
  ReorderSubgroupParams,
  UpdateWineAromaGroupParams,
  UpdateWineAromaSubgroupParams,
  WineAromaGroup,
  WineAromaSubgroup,
} from './types/flavor-types'
import { DataResponse, FiltersParams } from '../../general/entities/types'

export const wineFlavorService = {
  listGroups: (filters: FiltersParams = {}): Promise<DataResponse<WineAromaGroup>> => {
    const params: any = { ...filters }

    if (filters.include && filters.include.length > 0) {
      params.include = filters.include
    }

    return api.get(AROMA_CRUD_ENDPOINTS.GROUP.LIST, { params }).then(response => response.data)
  },

  listSubgroup: (include?: string[]): Promise<WineAromaSubgroup[]> =>
    api
      .get(AROMA_CRUD_ENDPOINTS.SUBGROUP.LIST, {
        params: include && include.length > 0 ? { include } : {},
      })
      .then(response => response.data),

  createGroup: (group: CreateWineAromaGroupRequest): Promise<WineAromaGroup> => api.post(AROMA_CRUD_ENDPOINTS.GROUP.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateWineAromaGroupParams): Promise<WineAromaGroup> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.UPDATE, { id: params.groupId }), params.newGroup).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.GROUP.DELETE, { id: groupId })).then(response => response.data),

  createSubgroup: (subgroupData: CreateWineAromaSubgroupParams & { groupId: number }): Promise<WineAromaSubgroup> =>
    api.post(AROMA_CRUD_ENDPOINTS.SUBGROUP.CREATE, subgroupData).then(response => response.data),

  updateSubgroup: (params: UpdateWineAromaSubgroupParams): Promise<WineAromaSubgroup> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.UPDATE, { id: params.subgroupId }), params.newSubgroup).then(response => response.data),

  deleteSubgroup: (subgroupId: string): Promise<void> => api.delete(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.DELETE, { id: subgroupId })).then(response => response.data),

  reorderSubgroup: (params: ReorderSubgroupParams): Promise<void> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.SUBGROUP.REORDER, { id: params.groupId }), { subgroupIds: params.subgroupIds }).then(response => response.data),

  reorderAromas: (params: ReorderAromasParams): Promise<void> =>
    api.patch(buildUrl(AROMA_CRUD_ENDPOINTS.AROMAS.REORDER, { id: params.subgrId }), { aromasIds: params.aromasIds }).then(response => response.data),
}
