import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaItemParams, WineAromaGroup } from '../entities/types/flavor'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'

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

  const itemsQuery = (groupId?: string) => {
    const query = useQuery({
      ...wineFlavorQueries.listItems(groupId),
      enabled: !!groupId,
    })

    useEffect(() => {
      if (query.data) {
        store.setAromaItems(query.data)
      }
    }, [query.data, store])

    return query
  }

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

  const createItemMutation = useMutation({
    ...wineFlavorQueries.createItem(),
    onSuccess: (newItem, variables) => {
      store.addAromaItem(variables.groupId, newItem)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', variables.groupId, 'items'] })
      queryClient.invalidateQueries({ queryKey: ['aroma-items', 'list'] })
    },
  })

  const updateItemMutation = useMutation({
    ...wineFlavorQueries.updateItem(),
    onSuccess: (updatedItem, variables) => {
      store.updateAromaItem(variables.groupId, variables.itemId, updatedItem)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', variables.groupId, 'items'] })
      queryClient.invalidateQueries({ queryKey: ['aroma-items', 'list'] })
    },
  })

  const deleteItemMutation = useMutation({
    ...wineFlavorQueries.deleteItem(),
    onSuccess: (_, variables) => {
      store.deleteAromaItem(variables.groupId, variables.itemId)
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', variables.groupId, 'items'] })
      queryClient.invalidateQueries({ queryKey: ['aroma-items', 'list'] })
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

  const createItem = (groupId: string, item: CreateWineAromaItemParams) => {
    return createItemMutation.mutateAsync({ groupId, item })
  }

  const updateItem = (groupId: string, itemId: string, newItem: CreateWineAromaItemParams) => {
    return updateItemMutation.mutateAsync({ groupId, itemId, newItem })
  }

  const deleteItem = (groupId: string, itemId: string) => {
    return deleteItemMutation.mutateAsync({ groupId, itemId })
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

  const getAromaGroupByValue = (value: string) => {
    return store.getAromaGroupByValue(value)
  }

  const hasAromaGroup = (id: string) => {
    return store.hasAromaGroup(id)
  }

  const hasAromaGroupByValue = (value: string) => {
    return store.hasAromaGroupByValue(value)
  }

  const getAromaItemById = (id: string) => {
    return store.getAromaItemById(id)
  }

  return {
    aromaGroups: store.aromaGroups,
    searchResults: store.searchResults,
    currentAromaGroup: store.currentAromaGroup,
    aromaItems: store.aromaItems,

    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isCreatingItem: createItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,

    createGroup,
    updateGroup,
    deleteGroup,
    createItem,
    updateItem,
    deleteItem,
    searchAromaGroups,
    clearSearch,
    setCurrentAromaGroup,
    getAromaGroupById,
    getAromaGroupByValue,
    hasAromaGroup,
    hasAromaGroupByValue,
    getAromaItemById,

    refetchGroups: groupsQuery.refetch,

    groupsQuery,
    itemsQuery,
  }
}
