import { wineFlavorService } from './wine-flavor-service'
import { CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaItemParams, StateItem } from './types/flavor'

export const wineFlavorQueries = {
  listGroups: () => ({
    queryKey: ['aroma-groups', 'list'],
    queryFn: () => wineFlavorService.listGroups(),
  }),

  createGroup: () => ({
    mutationKey: ['aroma-groups', 'create'],
    mutationFn: (group: Partial<CreateWineAromaGroupParams>) => wineFlavorService.createGroup(group),
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
    mutationFn: ({ groupId, item }: { groupId: string; item: CreateWineAromaItemParams & { state?: StateItem[] } }) => wineFlavorService.createItem(groupId, item),
  }),

  updateItem: () => ({
    mutationKey: ['aroma-items', 'update'],
    mutationFn: (params: { groupId: string; itemId: string; newItem: CreateWineAromaItemParams & { state?: StateItem[] } }) => wineFlavorService.updateItem(params),
  }),

  deleteItem: () => ({
    mutationKey: ['aroma-items', 'delete'],
    mutationFn: (params: { groupId: string; itemId: string }) => wineFlavorService.deleteItem(params),
  }),

  updateItemStates: () => ({
    mutationKey: ['aroma-items', 'update-states'],
    mutationFn: async (params: { groupId: string; itemId: string; states: StateItem[] }) => {
      const currentItems = await wineFlavorService.listItems(params.groupId)
      const currentItem = currentItems.find(item => item.id === params.itemId)

      if (!currentItem) {
        throw new Error(`Item ${params.itemId} not found in group ${params.groupId}`)
      }

      return wineFlavorService.updateItem({
        groupId: params.groupId,
        itemId: params.itemId,
        newItem: {
          name: currentItem.name,
          nameEn: currentItem.nameEn,
          value: currentItem.value,
          state: params.states,
        },
      })
    },
  }),
}
