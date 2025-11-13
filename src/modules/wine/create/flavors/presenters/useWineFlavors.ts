import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaSubgroupParams, UpdateWineAromaSubgroupParams, WineAromaGroup, WineAromaSubgroup } from '../entities/types/flavor-types'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'

interface DeleteSubgroupParams {
  subgroupId: string
  groupId: string
}

export const useWineFlavor = () => {
  const queryClient = useQueryClient()
  const store = useWineFlavorStore()

  const groupsQuery = useQuery({
    ...wineFlavorQueries.listGroups(['subgroups', 'assigned-colors']),
  })

  const customRefetchGroups = (include?: string[]) => {
    return queryClient.fetchQuery(wineFlavorQueries.listGroups(include))
  }

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

  return {
    aromaGroups: groupsQuery.data,
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

    createGroup,
    updateGroup,
    deleteGroup,
    createSubgroup,
    updateSubgroup,
    deleteSubgroup,
    searchAromaGroups,
    clearSearch,
    setCurrentAromaGroup,
    getAromaGroupById,
    getSubgroupById,
    getAromaById,
    hasAromaGroup,

    refetchGroups: groupsQuery.refetch,
    refetchGroupsWithParams: customRefetchGroups,
    groupsQuery,
  }
}
