import { useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useWineColorStore } from '../entities/wine-color-store'
import { wineColorQueries } from '../entities/wine-color-queries'
import { CreateShadesParams, CreateWineColorParams, ReorderShadesParams, UpdateWineColorParams, WineColorGroup, WineShades } from '../entities/types/color-types'
import { DataResponse } from '../../general/entities/types'
import { colorService } from '../entities/color-service'
import { getDisplayNames } from '@/lib/utils'

import { mockWineColorGroups } from '../entities/types/mockColor'

export const useWineColor = () => {
  const queryClient = useQueryClient()
  const store = useWineColorStore()

  const stableFilters = useMemo(() => {
    const filtersWithShades = {
      ...store.filters,
      include: Array.from(new Set([...(store.filters.include || []), 'shades'])),
    }
    return JSON.stringify(filtersWithShades)
  }, [store.filters])

  const groupsQuery: UseQueryResult<DataResponse<WineColorGroup>, Error> = useQuery<DataResponse<WineColorGroup>, Error>({
    queryKey: ['color-groups', 'list', stableFilters],
    queryFn: () =>
      colorService.list({
        ...store.filters,
        include: Array.from(new Set([...(store.filters.include || []), 'shades'])),
      }),
    placeholderData: prev => prev,
  })

  useEffect(() => {
    if (!groupsQuery.data || groupsQuery.isFetching) return
    store.setColorGroups(groupsQuery.data.rows)
  }, [groupsQuery.data, groupsQuery.isFetching])

  // const colorGroups = (): WineColorGroup[] => {
  //   const cached = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])
  //   return cached?.rows ?? []
  // }

  const createGroupMutation = useMutation<WineColorGroup, Error, CreateWineColorParams, { prev?: DataResponse<WineColorGroup>; tempId: string }>({
    mutationKey: ['color-groups', 'create'],
    mutationFn: groupData => colorService.create(groupData),

    onMutate: async groupData => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      const { nameUa, nameEn } = getDisplayNames(groupData.translations || [])
      const tempGroup: WineColorGroup = {
        id: 'temp-id-' + Date.now(),
        ...groupData,
        nameUa,
        nameEn,
        shades: [],
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters], old => ({
        ...old,
        rows: [tempGroup, ...(old?.rows || [])],
        count: old?.count ?? 0,
      }))

      return { prev, tempId: tempGroup.id }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
      }
    },

    onSuccess: (newGroup, _, ctx) => {
      const optimisticData = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])
      const tempGroup = optimisticData?.rows.find(g => g.id === ctx.tempId)

      if (tempGroup && newGroup.id) {
        const finalGroup: WineColorGroup = {
          ...tempGroup,
          id: newGroup.id,
        }

        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters], old => ({
          rows: [finalGroup, ...(old?.rows?.filter(g => g.id !== ctx.tempId) || [])],
          count: old?.count ?? 0,
        }))
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'], exact: false })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineColorQueries.updateGroup(),

    onMutate: async (params: UpdateWineColorParams) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      const optimistic: WineColorGroup = {
        id: params.colorId,
        translations: params.newColor.translations,
        colorHex: params.newColor.colorHex,
        shades: params.newColor.shades || [],
      }

      queryClient.setQueryData(['color-groups', 'list', stableFilters], (old: DataResponse<WineColorGroup>) => ({
        rows: old.rows.map(g => (g.id === params.colorId ? optimistic : g)),
        count: old.count,
      }))

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'], exact: false })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineColorQueries.deleteGroup(),

    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      queryClient.setQueryData(['color-groups', 'list', stableFilters], (old: DataResponse<WineColorGroup>) => ({
        rows: old.rows.filter(g => g.id !== groupId),
        count: old.count - 1,
      }))

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'], exact: false })
    },
  })

  const createShadeMutation = useMutation<WineShades, Error, { groupId: string; shadeData: CreateShadesParams }, { prev?: DataResponse<WineColorGroup>; tempId: string }>({
    mutationKey: ['color-shades', 'create'],
    mutationFn: ({ groupId, shadeData }) => colorService.createShade(groupId, shadeData),

    onMutate: async ({ groupId, shadeData }) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      const tempShade: WineShades = {
        id: 'temp-id-' + Date.now(),
        ...shadeData,
        colorHex: shadeData.colorHex || '',
        sortNumber: shadeData.sortNumber ?? 0,
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters], old => ({
        ...old,
        rows:
          old?.rows.map(g =>
            g.id === groupId
              ? {
                  ...g,
                  shades: [tempShade, ...(g.shades || [])],
                }
              : g
          ) || [],
        count: old?.count ?? 0,
      }))

      return { prev, tempId: tempShade.id }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
      }
    },
    onSuccess: (newShade, _, ctx) => {
      if (!newShade || Object.keys(newShade).length === 0) {
        return
      }
      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters], old => ({
        ...old,
        rows:
          old?.rows.map(g =>
            g.shades?.some(s => s.id === ctx?.tempId)
              ? {
                  ...g,
                  shades: g.shades.map(s => (s.id === ctx?.tempId ? { ...s, id: newShade.id } : s)),
                }
              : g
          ) || [],
        count: old?.count ?? 0,
      }))
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'], exact: false }),
  })

  const updateShadeMutation = useMutation({
    ...wineColorQueries.updateShade(),

    onMutate: async ({ groupId, shadeId, newShades }) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      const optimistic: WineShades = {
        id: shadeId,
        ...newShades,
        colorHex: newShades.colorHex || '',
        sortNumber: newShades.sortNumber ?? 0,
      }

      queryClient.setQueryData(['color-groups', 'list', stableFilters], (old: DataResponse<WineColorGroup>) => ({
        rows: old.rows.map(g =>
          g.id === groupId
            ? {
                ...g,
                shades: g.shades.map(s => (s.id === shadeId ? optimistic : s)),
              }
            : g
        ),
        count: old.count,
      }))

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'], exact: false })
    },
  })

  const deleteShadeMutation = useMutation<void, Error, { groupId: string; shadeId: string }, { prev?: DataResponse<WineColorGroup> }>({
    mutationKey: ['color-shades', 'delete'],

    mutationFn: ({ shadeId }) => colorService.deleteShade(shadeId),

    onMutate: async ({ groupId, shadeId }) => {
      await queryClient.cancelQueries({
        queryKey: ['color-groups', 'list'],
      })

      const prev = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', stableFilters])

      queryClient.setQueryData(['color-groups', 'list', stableFilters], (old: DataResponse<WineColorGroup>) => ({
        rows: old.rows.map(g =>
          g.id === groupId
            ? {
                ...g,
                shades: g.shades.filter(s => s.id !== shadeId),
              }
            : g
        ),
        count: old.count,
      }))

      return { prev }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['color-groups', 'list', stableFilters], ctx.prev)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['color-groups', 'list'],
        exact: false,
      })
    },
  })

  const reorderShadeMutation = useMutation({
    ...wineColorQueries.reorderShades(),
    onMutate: async (params: ReorderShadesParams) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = queryClient.getQueryData(['color-groups', 'list'])

      queryClient.setQueryData(['color-groups', 'list'], (old: any) => {
        if (!old) return old

        const reorderShadesInGroup = (shades: any[], newOrderIds: string[]) => {
          const shadeMap = new Map(shades.map(shade => [shade.id, shade]))
          return newOrderIds
            .map((id, index) => ({
              ...shadeMap.get(id),
              sortNumber: index,
            }))
            .filter(Boolean)
        }

        return old.map((group: any) => {
          if (group.id === params.colorId) {
            return {
              ...group,
              shades: reorderShadesInGroup(group.shades, params.shadeIds),
            }
          }
          return group
        })
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['color-groups', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  return {
    colorGroups: mockWineColorGroups,
    // colorGroups: colorGroups(),
    totalCount: groupsQuery.data?.count || 0,

    searchResults: store.searchResults,
    currentColorGroup: store.currentColorGroup,
    filters: store.filters,

    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,

    isCreatingShade: createShadeMutation.isPending,
    isUpdatingShade: updateShadeMutation.isPending,
    isDeletingShade: deleteShadeMutation.isPending,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,

    createShade: createShadeMutation.mutateAsync,
    updateShade: updateShadeMutation.mutateAsync,
    deleteShade: deleteShadeMutation.mutateAsync,
    reorderShade: reorderShadeMutation.mutateAsync,

    searchColorGroups: store.searchColorGroups,
    clearSearch: store.clearSearch,
    setCurrentColorGroup: store.setCurrentColorGroup,
    getColorGroupById: store.getColorGroupById,
    getShadeById: store.getShadeById,
    hasColorGroup: store.hasColorGroup,

    onChangePagination: (page: number) => store.setFilters({ page }),

    refetchGroups: groupsQuery.refetch,
  }
}
