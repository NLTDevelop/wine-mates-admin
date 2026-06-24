import { ReorderItem } from '../../general/entities/types'
import { CreateWineTasteGroupRequest, CreateWineTasteParams, UpdateWineTasteGroupParams, UpdateWineTasteParams } from './types/tastes'
import { tasteService } from './wine-taste-service'

export const wineTasteQueries = {
  listGroups: () => ({
    queryKey: ['taste-groups', 'list'],
    queryFn: () => tasteService.listGroups(),
  }),

  createGroup: () => ({
    mutationKey: ['taste-groups', 'create'],
    mutationFn: (group: CreateWineTasteGroupRequest) => tasteService.createGroup(group),
  }),

  updateGroup: () => ({
    mutationKey: ['taste-groups', 'update'],
    mutationFn: (params: UpdateWineTasteGroupParams) => tasteService.updateGroup(params),
  }),

  deleteGroup: () => ({
    mutationKey: ['taste-groups', 'delete'],
    mutationFn: (groupId: string) => tasteService.deleteGroup(groupId),
  }),

  reorderGroup: () => ({
    mutationKey: ['taste-groups', 'reorder'],
    mutationFn: (params: ReorderItem[]) => tasteService.reorderGroup(params),
  }),

  createTaste: () => ({
    mutationKey: ['taste', 'create'],
    mutationFn: ({ groupId, tasteData }: { groupId: string; tasteData: CreateWineTasteParams }) =>
      tasteService.createTaste({
        ...tasteData,
        groupId: parseInt(groupId),
      }),
  }),

  updateTaste: () => ({
    mutationKey: ['taste', 'update'],
    mutationFn: (params: UpdateWineTasteParams) => tasteService.updateTaste(params),
  }),

  deleteTaste: () => ({
    mutationKey: ['taste', 'delete'],
    mutationFn: ({ tasteId }: { groupId: string; tasteId: string }) => tasteService.deleteTaste(tasteId),
  }),

  reorderTaste: () => ({
    mutationKey: ['taste', 'reorder'],
    mutationFn: (params: ReorderItem[]) => tasteService.reorderTaste(params),
  }),
}
