import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineTypeParams, UpdateWineTypeParams, WineType } from '../entities/types/wine-type'
import { useWineTypeStore } from '../entities/wine-type-store'
import { wineTypeQueries } from '../entities/wine-type-queries'

export const useWineTypes = () => {
  const queryClient = useQueryClient()
  const store = useWineTypeStore()

  const wineTypeQuery = useQuery({ ...wineTypeQueries.list() })

  useEffect(() => {
    if (wineTypeQuery.data) {
      store.setWineTypes(wineTypeQuery.data)
    }
  }, [wineTypeQuery.data, store])

  const createMutation = useMutation({
    ...wineTypeQueries.create(),
    onSuccess: (newWineType: WineType) => {
      store.addWineType(newWineType)
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
  })

  const updateMutation = useMutation({
    ...wineTypeQueries.update(),
    onSuccess: (updatedWineType: WineType) => {
      store.updateWineType(updatedWineType.id, updatedWineType)
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
  })

  const deleteMutation = useMutation({
    ...wineTypeQueries.delete(),
    onSuccess: (_, wineTypeId) => {
      store.deleteWineType(wineTypeId)
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
  })

  const createWineType = (wineType: CreateWineTypeParams) => {
    console.log('Create wineType->', wineType)
    return createMutation.mutateAsync(wineType)
  }

  const updateWineType = (params: UpdateWineTypeParams) => {
    console.log('Update wineType->', params)
    return updateMutation.mutate(params)
  }

  const deleteWineType = (wineTypeId: string) => {
    deleteMutation.mutate(wineTypeId)
  }

 const searchTWineType = (searchTerm: string) => {
     store.searchWineType(searchTerm)
   }
 
   const clearSearch = () => {
     store.clearSearch()
   }
 
   const setCurrentWineType = (taste: WineType | null) => {
     store.setCurrentWineType(taste)
   }
 
   const getWineTypeById = (id: string) => {
     return store.getWineTypeById(id)
   }
 
 
   const hasWineType = (id: string) => {
     return store.hasWineType(id)
   }
 

  return {
    wineTypes: store.wineTypes,
    searchResults: store.searchResults,
    currentWineType: store.currentWineType,

    isLoading: wineTypeQuery.isLoading,
    isError: wineTypeQuery.isError,
    error: wineTypeQuery.error,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createWineType,
    updateWineType,
    deleteWineType,
    searchTWineType,
    clearSearch,
    setCurrentWineType,
    getWineTypeById,
    hasWineType,

    refetchTastes: wineTypeQuery.refetch,
    wineTypeQuery,
  }
}
