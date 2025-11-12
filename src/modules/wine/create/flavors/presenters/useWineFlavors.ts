import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  CreateWineAromaGroupParams,
  UpdateWineAromaGroupParams,
  CreateWineAromaItemParams,
  CreateWineAromaSubgroupParams,
  UpdateWineAromaSubgroupParams,
  WineAromaGroup,
  WineAromaSubgroup,
  WineAromaItem,
} from '../entities/types/flavor-types'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'
import { mockAromaGroups } from '../entities/mock'

interface DeleteSubgroupParams {
  subgroupId: string
  groupId: string
}

interface DeleteAromaParams {
  aromaId: string
  subgroupId: string
  groupId: string
}

export const useWineFlavor = () => {
  const queryClient = useQueryClient()
  const store = useWineFlavorStore()

  const groupsQuery = useQuery({
    ...wineFlavorQueries.listGroups(),
  })

  useEffect(() => {
    if (groupsQuery.data) {
      store.setAromaGroups(groupsQuery.data)
    }
  }, [groupsQuery.data, store])

  const createGroupMutation = useMutation({
    ...wineFlavorQueries.createGroup(),
    onSuccess: newGroup => {
      store.addAromaGroup(newGroup)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineFlavorQueries.updateGroup(),
    onSuccess: updatedGroup => {
      store.updateAromaGroup(updatedGroup.id, updatedGroup)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineFlavorQueries.deleteGroup(),
    onSuccess: (_, groupId) => {
      store.deleteAromaGroup(groupId)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const createSubgroupMutation = useMutation({
    ...wineFlavorQueries.createSubgroup(),
    onSuccess: (newSubgroup: WineAromaSubgroup, variables: CreateWineAromaSubgroupParams & { groupId: string }) => {
      store.addSubgroup(variables.groupId, newSubgroup)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const updateSubgroupMutation = useMutation({
    ...wineFlavorQueries.updateSubgroup(),
    onSuccess: (updatedSubgroup: WineAromaSubgroup, variables: UpdateWineAromaSubgroupParams & { groupId: string }) => {
      store.updateSubgroup(variables.groupId, variables.subgroupId, updatedSubgroup)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const deleteSubgroupMutation = useMutation({
    mutationKey: ['aroma-subgroups', 'delete'],
    mutationFn: (params: DeleteSubgroupParams) => wineFlavorQueries.deleteSubgroup().mutationFn(params.subgroupId),
    onSuccess: (_, variables: DeleteSubgroupParams) => {
      store.deleteSubgroup(variables.groupId, variables.subgroupId)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const createAromaMutation = useMutation({
    ...wineFlavorQueries.createAroma(),
    onSuccess: (newAroma: WineAromaItem, variables: CreateWineAromaItemParams & { subgroupId: string; groupId: string }) => {
      store.addAroma(variables.groupId, variables.subgroupId, newAroma)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const updateAromaMutation = useMutation({
    ...wineFlavorQueries.updateAroma(),
    onSuccess: (updatedAroma: WineAromaItem, variables: { aromaId: string; newAroma: CreateWineAromaItemParams } & { subgroupId: string; groupId: string }) => {
      store.updateAroma(variables.groupId, variables.subgroupId, variables.aromaId, updatedAroma)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const deleteAromaMutation = useMutation({
    mutationKey: ['aroma-items', 'delete'],
    mutationFn: (params: DeleteAromaParams) => wineFlavorQueries.deleteAroma().mutationFn(params.aromaId),
    onSuccess: (_, variables: DeleteAromaParams) => {
      store.deleteAroma(variables.groupId, variables.subgroupId, variables.aromaId)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const createGroup = (group: CreateWineAromaGroupParams) => {
    return createGroupMutation.mutateAsync(group)
  }

  const updateGroup = (params: UpdateWineAromaGroupParams) => {
    return updateGroupMutation.mutateAsync(params)
  }

  const deleteGroup = (groupId: string) => {
    return deleteGroupMutation.mutateAsync(groupId)
  }

  const createSubgroup = (groupId: string, subgroup: CreateWineAromaSubgroupParams) => {
    return createSubgroupMutation.mutateAsync({ ...subgroup, groupId })
  }

  const updateSubgroup = (groupId: string, params: UpdateWineAromaSubgroupParams) => {
    return updateSubgroupMutation.mutateAsync({ ...params, groupId })
  }

  const deleteSubgroup = (groupId: string, subgroupId: string) => {
    return deleteSubgroupMutation.mutateAsync({ subgroupId, groupId })
  }

  const createAroma = (groupId: string, subgroupId: string, aroma: CreateWineAromaItemParams) => {
    return createAromaMutation.mutateAsync({ ...aroma, groupId, subgroupId })
  }

  const updateAroma = (groupId: string, subgroupId: string, aromaId: string, newAroma: CreateWineAromaItemParams) => {
    return updateAromaMutation.mutateAsync({ aromaId, newAroma, groupId, subgroupId })
  }

  const deleteAroma = (groupId: string, subgroupId: string, aromaId: string) => {
    return deleteAromaMutation.mutateAsync({ aromaId, groupId, subgroupId })
  }

  const searchAromaGroups = (searchTerm: string) => {
    store.searchAromaGroups(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentAromaGroup = (group: WineAromaGroup | null) => {
    store.setCurrentAromaGroup(group)
  }

  const getAromaGroupById = (id: string) => {
    return store.getAromaGroupById(id)
  }

  const getSubgroupById = (groupId: string, subgroupId: string) => {
    return store.getSubgroupById(groupId, subgroupId)
  }

  const getAromaById = (groupId: string, subgroupId: string, aromaId: string) => {
    return store.getAromaById(groupId, subgroupId, aromaId)
  }

  const hasAromaGroup = (id: string) => {
    return store.hasAromaGroup(id)
  }

  const aromaGroups = mockAromaGroups

  return {
    aromaGroups,
    searchResults: store.searchResults,
    currentAromaGroup: store.currentAromaGroup,

    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isCreatingSubgroup: createSubgroupMutation.isPending,
    isUpdatingSubgroup: updateSubgroupMutation.isPending,
    isDeletingSubgroup: deleteSubgroupMutation.isPending,
    isCreatingAroma: createAromaMutation.isPending,
    isUpdatingAroma: updateAromaMutation.isPending,
    isDeletingAroma: deleteAromaMutation.isPending,

    createGroup,
    updateGroup,
    deleteGroup,
    createSubgroup,
    updateSubgroup,
    deleteSubgroup,
    createAroma,
    updateAroma,
    deleteAroma,
    searchAromaGroups,
    clearSearch,
    setCurrentAromaGroup,
    getAromaGroupById,
    getSubgroupById,
    getAromaById,
    hasAromaGroup,

    refetchGroups: groupsQuery.refetch,
    groupsQuery,
  }
}
