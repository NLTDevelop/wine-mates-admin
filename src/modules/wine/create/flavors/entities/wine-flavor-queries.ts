import { wineFlavorService } from './wine-flavor-service'
import { CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaItemParams } from './types/flavor'

export const wineFlavorQueries = {
  listGroups: () => ({
    queryKey: ['aroma-groups', 'list'],
    queryFn: () => wineFlavorService.listGroups(),
  }),

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

  listItems: (groupId?: string) => ({
    queryKey: groupId ? ['aroma-groups', groupId, 'items'] : ['aroma-items', 'list'],
    queryFn: () => wineFlavorService.listItems(groupId),
  }),

  createItem: () => ({
    mutationKey: ['aroma-items', 'create'],
    mutationFn: ({ groupId, item }: { groupId: string; item: CreateWineAromaItemParams }) => wineFlavorService.createItem(groupId, item),
  }),

  updateItem: () => ({
    mutationKey: ['aroma-items', 'update'],
    mutationFn: (params: { groupId: string; itemId: string; newItem: CreateWineAromaItemParams }) => wineFlavorService.updateItem(params),
  }),

  deleteItem: () => ({
    mutationKey: ['aroma-items', 'delete'],
    mutationFn: (params: { groupId: string; itemId: string }) => wineFlavorService.deleteItem(params),
  }),
}
