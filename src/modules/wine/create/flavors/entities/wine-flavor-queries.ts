import { FiltersParams } from '@/lib/client-pagination'
import { CreateWineAromaGroupParams, CreateWineAromaSubgroupParams, UpdateWineAromaGroupParams, UpdateWineAromaSubgroupParams } from './types/flavor-types'
import { wineFlavorService } from './wine-flavor-service'

export const wineFlavorQueries = {
   listGroups: (filters: FiltersParams = {}) => ({
     queryKey: ['aroma-groups', 'list', filters],
     queryFn: () => wineFlavorService.listGroups(filters),
   }),
  // listGroups: (include?: string[]) => ({
  //   queryKey: ['aroma-groups', 'list', ...(include || [])],
  //   queryFn: () => wineFlavorService.listGroups(include),
  // }),

  createGroup: () => ({
    mutationKey: ['aroma-groups', 'create'],
    mutationFn: (group: CreateWineAromaGroupParams) => wineFlavorService.createGroup(group),
  }),

  updateGroup: () => ({
    mutationKey: ['aroma-groups', 'update'],
    mutationFn: (params: UpdateWineAromaGroupParams) => wineFlavorService.updateGroup(params),
  }),

  deleteGroup: () => ({
    mutationKey: ['aroma-groups', 'delete'],
    mutationFn: (groupId: string) => wineFlavorService.deleteGroup(groupId),
  }),

  createSubgroup: () => ({
    mutationKey: ['aroma-subgroups', 'create'],
    mutationFn: ({ subgroupData }: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }) => 
      wineFlavorService.createSubgroup(subgroupData),
  }),

  updateSubgroup: () => ({
    mutationKey: ['aroma-subgroups', 'update'],
    mutationFn: (params: UpdateWineAromaSubgroupParams) => wineFlavorService.updateSubgroup(params),
  }),

  deleteSubgroup: () => ({
    mutationKey: ['aroma-subgroups', 'delete'],
    mutationFn: (subgroupId: string) => wineFlavorService.deleteSubgroup(subgroupId),
  }),
}
