import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { BaseWineColor, DataResponse } from '../../general/entities/types'
import { useEffect, useMemo } from 'react'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { CreateWineAromaGroupParams, CreateWineAromaSubgroupParams, UpdateWineAromaGroupParams, WineAromaGroup, WineAromaSubgroup } from '../entities/types/flavor-types'
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

    onMutate: async (groupData: CreateWineAromaGroupParams) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })
      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      const tempGroup: WineAromaGroup = {
        id: 'temp-id-' + Date.now(),
        ...groupData,
        colors: groupData.colors || cachedColors || [],
        subgroups: [],
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
        nameUa: params.newGroup.nameUa,
        nameEn: params.newGroup.nameEn,
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

  const createSubgroup = useMutation({
    ...wineFlavorQueries.createSubgroup(),

    onMutate: async ({ groupId, subgroupData }: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', stableFilters])

      const tempSub: WineAromaSubgroup = {
        id: 'temp-id-' + Date.now(),
        nameUa: subgroupData.nameUa,
        nameEn: subgroupData.nameEn,
        sortNumber: subgroupData.sortNumber ?? 0,
        aromas: subgroupData.aromas ?? [],
        groupId: parseInt(groupId),
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
                  subgroups: g.subgroups.map(s => (s.id === subgroupId ? { ...s, ...newSubgroup } : s)),
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
    isCreatingSubAroma: createSubgroup.isPending,
    isUpdatingSubgroup: updateSubgroup.isPending,
    isDeletingSubgroup: deleteSubgroup.isPending,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    createSubgroup: createSubgroup.mutateAsync,
    updateSubgroup: updateSubgroup.mutateAsync,
    deleteSubgroup: deleteSubgroup.mutateAsync,

    onChangePagination,
    refetchGroups: groupsQuery.refetch,
  }
}
