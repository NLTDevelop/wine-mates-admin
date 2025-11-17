import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useWineColorStore } from '../entities/wine-color-store'
import { wineColorQueries } from '../entities/wine-color-queries'
import { CreateShadesParams, CreateWineColorParams, UpdateWineColorParams, WineColorGroup, WineShades } from '../entities/types/color-types'
import { DataResponse, FiltersParams } from '../../general/entities/types'

export const useWineColor = () => {
  const queryClient = useQueryClient()
  const store = useWineColorStore()

  const groupsQuery: UseQueryResult<DataResponse<WineColorGroup>, Error> = useQuery({
    ...wineColorQueries.listGroups({
      limit: store.filters.limit,
      offset: store.filters.offset,
      search: store.filters.search,
      include: ['shades'],
    }),
  })

  const getCurrentColorGroups = () => {
    const data = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters])
    return data || { rows: [], count: 0 }
  }

  const customRefetchGroups = (filters?: FiltersParams) => {
    return queryClient.fetchQuery(wineColorQueries.listGroups(filters))
  }

  const createGroupMutation = useMutation({
    ...wineColorQueries.createGroup(),
    onMutate: async (newColor: CreateWineColorParams) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const optimisticGroup: WineColorGroup = {
        id: `temp-${Date.now()}`,
        nameUa: newColor.nameUa,
        nameEn: newColor.nameEn,
        colorHex: newColor.colorHex,
        shades: newColor.shades || [],
      }

      const currentRows = groupsQuery.data?.rows || []
      const currentCount = groupsQuery.data?.count || 0

      const newData = {
        rows: [...currentRows, optimisticGroup],
        count: currentCount + 1,
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], newData)

      return { optimisticGroup, previousData: groupsQuery.data }
    },
    onSuccess: (newGroup: WineColorGroup, _, context) => {
      if (context?.optimisticGroup) {
        const groupWithShades = {
          ...newGroup,
          shades: newGroup.shades && newGroup.shades.length > 0 ? newGroup.shades : context.optimisticGroup.shades,
        }
        const currentData = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters])

        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows.map((cg: WineColorGroup) => (cg.id === context.optimisticGroup.id ? groupWithShades : cg)),
          count: old.count,
        }))

        if (currentData) {
          const updatedData = {
            rows: currentData.rows.map(cg => (cg.id === context.optimisticGroup.id ? groupWithShades : cg)),
            count: currentData.count,
          }

          queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], updatedData)
        }
      }
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['color-groups', 'list', store.filters],
        refetchType: 'active',
      })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineColorQueries.updateGroup(),
    onMutate: async (params: UpdateWineColorParams) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters])

      const optimisticGroup: WineColorGroup = {
        id: params.colorId,
        nameUa: params.newColor.nameUa,
        nameEn: params.newColor.nameEn,
        colorHex: params.newColor.colorHex,
        shades: params.newColor.shades || [],
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((cg: WineColorGroup) => (cg.id === params.colorId ? optimisticGroup : cg)),
        count: old.count,
      }))

      return { previousGroups, optimisticGroup, params }
    },
    onSuccess: (updatedGroup: WineColorGroup, _, context) => {
      if (!updatedGroup && context?.optimisticGroup) {
        return
      }

      if (updatedGroup) {
        const wineTypeWithColors = {
          ...updatedGroup,
          colors: updatedGroup.shades && updatedGroup.shades.length > 0 ? updatedGroup.shades : context?.optimisticGroup?.shades || [],
        }

        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows?.map((cg: WineColorGroup) => (cg.id === updatedGroup.id ? wineTypeWithColors : cg)) || [],
          count: old.count,
        }))
      }
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineColorQueries.deleteGroup(),
    onMutate: async (colorId: string) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = queryClient.getQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters])
      const deletedGroup = previousGroups?.rows.find((cg: WineColorGroup) => cg.id === colorId)

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.filter((cg: WineColorGroup) => cg.id !== colorId),
        count: old.count - 1,
      }))

      return { previousGroups, deletedGroup }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const createShadeMutation = useMutation({
    ...wineColorQueries.createShade(),
    onMutate: async ({ groupId, shadeData }: { groupId: string; shadeData: CreateShadesParams }) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = getCurrentColorGroups()

      const optimisticShade: WineShades = {
        id: `temp-shade-${Date.now()}`,
        nameUa: shadeData.nameUa,
        nameEn: shadeData.nameEn,
        tonePale: shadeData.tonePale,
        toneMedium: shadeData.toneMedium,
        toneDeep: shadeData.toneDeep,
        colorHex: shadeData.colorHex || '',
        sortNumber: shadeData.sortNumber || 0,
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((cg: WineColorGroup) => (cg.id === groupId ? { ...cg, shades: [...(cg.shades || []), optimisticShade] } : cg)),
        count: old.count,
      }))

      return { previousGroups, optimisticShade, groupId }
    },
    onSuccess: (newShade: WineShades, variables, context) => {
      if (context?.optimisticShade) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows.map((cg: WineColorGroup) =>
            cg.id === variables.groupId
              ? {
                  ...cg,
                  shades: cg.shades.map(shade => (shade.id === context.optimisticShade.id ? newShade : shade)),
                }
              : cg
          ),
          count: old.count,
        }))
      }
      queryClient.invalidateQueries({
        queryKey: ['color-groups', 'list'],
      })
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
      }
    },
  })

  const updateShadeMutation = useMutation({
    ...wineColorQueries.updateShade(),
    onMutate: async ({ groupId, shadeId, newShades }: { groupId: string; shadeId: string; newShades: CreateShadesParams }) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = getCurrentColorGroups()

      const optimisticShade: WineShades = {
        id: shadeId,
        nameUa: newShades.nameUa,
        nameEn: newShades.nameEn,
        tonePale: newShades.tonePale,
        toneMedium: newShades.toneMedium,
        toneDeep: newShades.toneDeep,
        colorHex: newShades.colorHex || '',
        sortNumber: newShades.sortNumber || 0,
      }

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((cg: WineColorGroup) =>
          cg.id === groupId
            ? {
                ...cg,
                shades: cg.shades.map(shade => (shade.id === shadeId ? optimisticShade : shade)),
              }
            : cg
        ),
        count: old.count,
      }))

      return { previousGroups, optimisticShade, groupId, shadeId }
    },
    onSuccess: (updatedShade: WineShades, variables, context) => {
      if (updatedShade && context?.optimisticShade) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows.map((cg: WineColorGroup) =>
            cg.id === variables.groupId
              ? {
                  ...cg,
                  shades: cg.shades.map(shade => (shade.id === variables.shadeId ? updatedShade : shade)),
                }
              : cg
          ),
          count: old.count,
        }))
      }
      queryClient.invalidateQueries({
        queryKey: ['color-groups', 'list'],
      })
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
      }
    },
  })

  const deleteShadeMutation = useMutation({
    ...wineColorQueries.deleteShade(),
    onMutate: async (shadeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['color-groups', 'list'] })

      const previousGroups = getCurrentColorGroups()

      const groupWithShade = previousGroups?.rows.find(cg => cg.shades.some(shade => shade.id === shadeId))

      queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], (old: DataResponse<WineColorGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((cg: WineColorGroup) => (cg.id === groupWithShade?.id ? { ...cg, shades: cg.shades.filter(shade => shade.id !== shadeId) } : cg)),
        count: old.count,
      }))

      return { previousGroups, deletedShadeId: shadeId, groupId: groupWithShade?.id }
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineColorGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const createGroup = (group: CreateWineColorParams) => {
    return createGroupMutation.mutateAsync(group)
  }

  const updateGroup = (params: UpdateWineColorParams) => {
    return updateGroupMutation.mutateAsync(params)
  }

  const deleteGroup = (colorId: string) => {
    return deleteGroupMutation.mutateAsync(colorId)
  }

  const createShade = (groupId: string, shadeData: CreateShadesParams) => {
    return createShadeMutation.mutateAsync({ groupId, shadeData })
  }

  const updateShade = (groupId: string, shadeId: string, newShades: CreateShadesParams) => {
    return updateShadeMutation.mutateAsync({ groupId, shadeId, newShades })
  }

  const deleteShade = (_: string, shadeId: string) => {
    return deleteShadeMutation.mutateAsync(shadeId)
  }

  const searchColorGroups = (searchTerm: string) => {
    store.searchColorGroups(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentColorGroup = (group: WineColorGroup | null) => {
    store.setCurrentColorGroup(group)
  }

  const getColorGroupById = (id: string) => {
    return store.getColorGroupById(id)
  }

  const getShadeById = (groupId: string, shadeId: string) => {
    return store.getShadeById(groupId, shadeId)
  }

  const hasColorGroup = (id: string) => {
    return store.hasColorGroup(id)
  }

  const onChangePagination = (offset: number) => {
    store.setFilters({ offset })
  }

  return {
    colorGroups: groupsQuery.data?.rows || [],
    searchResults: store.searchResults,
    currentColorGroup: store.currentColorGroup,
    totalCount: groupsQuery?.data?.count || 0,
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

    createGroup,
    updateGroup,
    deleteGroup,
    createShade,
    updateShade,
    deleteShade,

    searchColorGroups,
    clearSearch,
    setCurrentColorGroup,
    getColorGroupById,
    getShadeById,
    hasColorGroup,
    onChangePagination,

    refetchGroups: groupsQuery.refetch,
    refetchGroupsWithParams: customRefetchGroups,
    groupsQuery,
  }
}
