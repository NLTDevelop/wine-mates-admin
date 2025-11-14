import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useWineColorStore } from '../entities/wine-color-store'
import { wineColorQueries } from '../entities/wine-color-queries'
import { CreateShadesParams, CreateWineColorParams, UpdateWineColorParams, WineColorGroup } from '../entities/types/color-types'

export const useWineColor = () => {
  const queryClient = useQueryClient()
  const store = useWineColorStore()

  const groupsQuery = useQuery({
    ...wineColorQueries.listGroups(['shades']),
  })

  const customRefetchGroups = (include?: string[]) => {
    return queryClient.fetchQuery(wineColorQueries.listGroups(include))
  }

  useEffect(() => {
    if (groupsQuery.data) {
      store.setColorGroups(groupsQuery.data)
    }
  }, [groupsQuery.data, store])

  const createGroupMutation = useMutation({
    ...wineColorQueries.createGroup(),
    onSuccess: (newGroup: WineColorGroup) => {
      store.addColorGroup(newGroup)
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineColorQueries.updateGroup(),
    onSuccess: (updatedGroup: WineColorGroup) => {
      store.updateColorGroup(updatedGroup.id, updatedGroup)
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineColorQueries.deleteGroup(),
    onSuccess: (_, groupId: string) => {
      store.deleteColorGroup(groupId)
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const createShadeMutation = useMutation({
    ...wineColorQueries.createShade(),
    onSuccess: (newShade: any, variables: { groupId: string; shadeData: CreateShadesParams }) => {
      store.addShade(variables.groupId, newShade)
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const updateShadeMutation = useMutation({
    ...wineColorQueries.updateShade(),
    onSuccess: (updatedShade: any, variables: { groupId: string; shadeId: string; newShades: CreateShadesParams }) => {
      store.updateShade(variables.groupId, variables.shadeId, updatedShade)
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const deleteShadeMutation = useMutation({
    ...wineColorQueries.deleteShade(),
    onSuccess: (_, shadeId: string) => {
      const colorGroups = store.colorGroups
      colorGroups.forEach(group => {
        if (group.shades.some(shade => shade.id === shadeId)) {
          store.deleteShade(group.id, shadeId)
        }
      })
      queryClient.invalidateQueries({ queryKey: ['color-groups', 'list'] })
    },
  })

  const createGroup = (group: CreateWineColorParams) => {
    return createGroupMutation.mutateAsync(group)
  }

  const updateGroup = (params: UpdateWineColorParams) => {
    return updateGroupMutation.mutateAsync(params)
  }

  const deleteGroup = (groupId: string) => {
    return deleteGroupMutation.mutateAsync(groupId)
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

  return {
    colorGroups: groupsQuery.data,
    searchResults: store.searchResults,
    currentColorGroup: store.currentColorGroup,

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

    refetchGroups: groupsQuery.refetch,
    refetchGroupsWithParams: customRefetchGroups,
    groupsQuery,
  }
}
