import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { BaseWineColor, DataResponse, ReorderItem } from '../../general/entities/types'
import { useEffect, useMemo } from 'react'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { CreateWineAromaGroupRequest, CreateWineAromaSubgroupParams, UpdateWineAromaGroupParams, WineAromaGroup, WineAromaSubgroup } from '../entities/types/flavor-types'
import { wineFlavorService } from '../entities/wine-flavor-service'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'

export const useWineFlavor = (cachedColors: BaseWineColor[]) => {
  const queryClient = useQueryClient()
  const store = useWineFlavorStore()

  const stableFilters = useMemo(() => {
    const filtersWithSubAromas = {
      ...store.filters,
      include: Array.from(new Set([...(store.filters.include || []), 'subgroups'])),
    }
    return JSON.stringify(filtersWithSubAromas)
  }, [store.filters])

  const groupsQuery: UseQueryResult<{ rows: WineAromaGroup[]; count: number }, Error> = useQuery({
    queryKey: ['aroma-groups', 'list', stableFilters],
    queryFn: () =>
      wineFlavorService.listGroups({
        ...store.filters,
        include: ['subgroups', 'assigned-colors'],
      }),
    placeholderData: prev => prev,
  })

  useEffect(() => {
    if (!groupsQuery.data || groupsQuery.isFetching) return
    store.setAromaGroups(groupsQuery.data.rows)
  }, [groupsQuery.data, groupsQuery.isFetching])

  const aromaGroups = (): WineAromaGroup[] => {
    const cached = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])
    return cached?.rows ?? []
  }

  const createGroupMutation = useMutation({
    ...wineFlavorQueries.createGroup(),

    onMutate: async (groupData: CreateWineAromaGroupRequest) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])
      const assignedColors = cachedColors?.filter(color => groupData.colorIds.includes(color.id)) || []

      const tempGroup: WineAromaGroup = {
        id: 'temp-id-' + Date.now(),
        ...groupData,
        colors: assignedColors,
        subgroups: [],
        sortNumber: 0,
      }

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters], old => ({
        ...old,
        rows: [tempGroup, ...(old?.rows || [])],
        count: old?.count ?? 0,
      }))

      return { prev, tempId: tempGroup.id }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSuccess: (newGroup: WineAromaGroup, _, ctx) => {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters], old => ({
        rows: [newGroup, ...(old?.rows?.filter(g => g.id !== ctx.tempId) || [])],
        count: old?.count ?? 0,
      }))
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'], exact: false })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineFlavorQueries.updateGroup(),

    onMutate: async (params: UpdateWineAromaGroupParams) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      const currentGroup = prev?.rows.find(g => g.id === params.groupId)
      const assignedColors = cachedColors.filter(color => params.newGroup.colorIds?.includes(color.id)) || currentGroup?.colors || []

      const optimistic: WineAromaGroup = {
        id: params.groupId,
        translations: params.newGroup.translations,
        colorHex: params.newGroup.colorHex,
        colors: assignedColors || [],
        subgroups: currentGroup?.subgroups || [],
        sortNumber: currentGroup?.sortNumber || 0,
      }

      queryClient.setQueryData<{ rows: WineAromaGroup[]; count: number }>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) {
          return { rows: [optimistic], count: 1 }
        }

        return {
          rows: old.rows.map(g => (g.id === params.groupId ? optimistic : g)),
          count: old.count,
        }
      })

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters], exact: false })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineFlavorQueries.deleteGroup(),

    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      store.deleteAromaGroup(groupId)

      queryClient.setQueryData<{ rows: WineAromaGroup[]; count: number }>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) {
          return { rows: [], count: 0 }
        }

        return {
          rows: old.rows.filter(g => g.id !== groupId),
          count: Math.max(old.count - 1, 0),
        }
      })

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters], exact: false })
    },
  })

  const reorderGroupMutation = useMutation({
    ...wineFlavorQueries.reorderGroup(),

    onMutate: async (reorderParams: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const previousGroups = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      store.reorderAromaGroups(reorderParams)

      const sortMap = new Map(reorderParams.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) return old

        const updatedRows = old.rows
          .map(group => {
            const newSortNumber = sortMap.get(Number(group.id))
            return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
          })
          .sort((a, b) => a.sortNumber - b.sortNumber)

        return {
          ...old,
          rows: updatedRows,
        }
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['aroma-groups', 'list', stableFilters], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
    },
  })

  const createSubgroup = useMutation({
    ...wineFlavorQueries.createSubgroup(),

    onMutate: async ({ groupId, subgroupData }: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      const tempSub: WineAromaSubgroup = {
        id: 'temp-id-' + Date.now(),
        translations: subgroupData.translations ?? [],
        sortNumber: subgroupData.sortNumber ?? 0,
        aromas: subgroupData.aromas ?? [],
        groupId: parseInt(groupId),
        colorHex: subgroupData.colorHex ?? '',
      }

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) return { rows: [], count: 0 }

        return {
          ...old,
          rows: old.rows.map(g => (g.id === groupId ? { ...g, subgroups: [tempSub, ...(g.subgroups || [])] } : g)),
          count: old.count,
        }
      })

      return { prev, tempId: tempSub.id }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSuccess: (newSubgroup, _, ctx) => {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters], old => ({
        ...old,
        rows:
          old?.rows.map(g =>
            g.subgroups?.some(s => s.id === ctx?.tempId)
              ? {
                  ...g,
                  shades: g.subgroups.map(s => (s.id === ctx?.tempId ? newSubgroup : s)),
                }
              : g
          ) || [],
        count: old?.count ?? 0,
      }))
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
    },
  })

  const updateSubgroup = useMutation({
    ...wineFlavorQueries.updateSubgroup(),

    onMutate: async ({ groupId, subgroupId, newSubgroup }: any) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      queryClient.setQueryData<{ rows: WineAromaGroup[]; count: number }>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) return { rows: [], count: 0 }

        return {
          ...old,
          rows: old.rows.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  subgroups: g.subgroups.map(s => {
                    if (s.id === subgroupId) {
                      const updatedAromas = newSubgroup.aromas?.map(({ sortNumber, ...aroma }: any) => aroma) || []
                      return {
                        ...s,
                        ...newSubgroup,
                        aromas: updatedAromas,
                      }
                    }
                    return s
                  }),
                }
              : g
          ),
          count: old.count,
        }
      })

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
    },
  })

  const deleteSubgroup = useMutation({
    ...wineFlavorQueries.deleteSubgroup(),

    onMutate: async ({ groupId, subgroupId }) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      queryClient.setQueryData<{ rows: WineAromaGroup[]; count: number }>(['aroma-groups', 'list', stableFilters], old => {
        if (!old) return { rows: [], count: 0 }

        return {
          ...old,
          rows: old.rows.map(g => (g.id === groupId ? { ...g, subgroups: g.subgroups.filter(s => s.id !== subgroupId) } : g)),
          count: old.count,
        }
      })

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['aroma-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
    },
  })

  const reorderSubgroupMutation = useMutation({
    ...wineFlavorQueries.reorderSubgroup(),
    onMutate: async (items: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

      const previousGroups = queryClient.getQueryData(['aroma-groups', 'list'])

      const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData(['aroma-groups', 'list'], (old: any) => {
        if (!old?.rows) return old

        const updatedRows = old.rows.map((group: any) => {
          const updatedSubgroups =
            group.subgroups
              ?.map((subgroup: any) => {
                const newSortNumber = sortMap.get(subgroup.id)
                return newSortNumber !== undefined ? { ...subgroup, sortNumber: newSortNumber } : subgroup
              })
              .sort((a: any, b: any) => a.sortNumber - b.sortNumber) || []

          return {
            ...group,
            subgroups: updatedSubgroups,
          }
        })

        return { ...old, rows: updatedRows }
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['aroma-groups', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const reorderAromasMutation = useMutation({
    ...wineFlavorQueries.reorderAromas(),
    onMutate: async (items: ReorderItem[]) => {
      const queryKey = ['aroma-subgroups', 'list', ['assigned-colors', 'aromas']]

      await queryClient.cancelQueries({ queryKey })

      const previousAromas = queryClient.getQueryData(queryKey)

      const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.rows) return old

        const updatedRows = old.rows
          .map((aroma: any) => {
            const newSortNumber = sortMap.get(aroma.id)
            return newSortNumber !== undefined ? { ...aroma, sortNumber: newSortNumber } : aroma
          })
          .sort((a: any, b: any) => a.sortNumber - b.sortNumber)

        return { ...old, rows: updatedRows }
      })

      return { previousAromas }
    },

    onError: (_, __, context) => {
      if (context?.previousAromas) {
        queryClient.setQueryData(['aroma-subgroups', 'list', ['assigned-colors', 'aromas']], context.previousAromas)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-subgroups', 'list', ['assigned-colors', 'aromas']] })
    },
  })

  const onChangePagination = (page: number) => store.setFilters({ page })

  return {
    aromaGroups: aromaGroups(),
    totalCount: groupsQuery.data?.count || 0,

    filters: store.filters,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isReorderingGroup: reorderGroupMutation.isPending,
    isCreatingSubAroma: createSubgroup.isPending,
    isUpdatingSubgroup: updateSubgroup.isPending,
    isDeletingSubgroup: deleteSubgroup.isPending,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    reorderGroup: reorderGroupMutation.mutateAsync,
    createSubgroup: createSubgroup.mutateAsync,
    updateSubgroup: updateSubgroup.mutateAsync,
    deleteSubgroup: deleteSubgroup.mutateAsync,
    reorderSubgroup: reorderSubgroupMutation.mutateAsync,
    reorderAromas: reorderAromasMutation.mutateAsync,

    onChangePagination,
    refetchGroups: groupsQuery.refetch,
  }
}
