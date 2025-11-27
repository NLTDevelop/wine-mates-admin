import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useWineTypeStore } from '../entities/wine-type-store'
import { wineTypeQueries } from '../entities/wine-type-queries'
import { CreateWineTypeRequest, UpdateWineTypeParams, WineType } from '../entities/types/wine-type'
import { BaseWineColor } from '../../general/entities/types'
// import { mockWineTypes } from '../entities/mock'
import { getDisplayNames } from '@/lib/utils'

export const useWineTypes = (cachedColors?: BaseWineColor[]) => {
  const queryClient = useQueryClient()
  const store = useWineTypeStore()

  const wineTypeQuery = useQuery({ ...wineTypeQueries.list(['assigned-colors']) })

  const customRefetchGroups = (include?: string[]) => {
    return queryClient.fetchQuery(wineTypeQueries.list(include))
  }

  useEffect(() => {
    if (cachedColors && cachedColors.length > 0) {
      queryClient.invalidateQueries({
        queryKey: ['wine-types', 'list', 'assigned-colors'],
      })
    }
  }, [cachedColors, queryClient])

  useEffect(() => {
    if (wineTypeQuery.data !== undefined) {
      store.setWineTypes(wineTypeQuery.data)
    }
  }, [wineTypeQuery.data, store])

  const createMutation = useMutation({
    ...wineTypeQueries.create(),
    onMutate: async (newWineType: CreateWineTypeRequest) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })

      const assignedColors = cachedColors?.filter(color => newWineType.colorIds.includes(color.id)) || []

      const { nameUa, nameEn } = getDisplayNames(newWineType.translations || [])
      const optimisticWineType: WineType = {
        id: `temp-${Date.now()}`,
        translations: newWineType.translations ?? [],
        colors: assignedColors ?? [],
        sortNumber: 0,
        nameUa,
        nameEn,
      }

      queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => {
        const newData = [...old, optimisticWineType]
        return newData
      })

      return { optimisticWineType }
    },

    onSuccess: (newWineType: WineType, _, context) => {
      if (context?.optimisticWineType) {
        const finalId = newWineType?.id || context.optimisticWineType.id

        const finalWineType = {
          ...context.optimisticWineType,
          id: finalId,
        }
        queryClient.invalidateQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => old.map(wt => (wt.id === context.optimisticWineType.id ? finalWineType : wt)))
      }
    },
    onError: (_, __, context) => {
      if (context?.optimisticWineType) {
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => old.filter(wt => wt.id !== context.optimisticWineType.id))
      }
    },
  })

  const updateMutation = useMutation({
    ...wineTypeQueries.update(),
    onMutate: async (params: UpdateWineTypeParams) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })

      const previousWineTypes = queryClient.getQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'])

      const assignedColors = cachedColors?.filter(color => params.newWineType.colorIds.includes(color.id)) || []

      const optimisticWineType: WineType = {
        id: params.wineTypeId,
        translations: params.newWineType.translations,
        colors: assignedColors,
        sortNumber: 0,
      }

      queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => old?.map(wt => (wt.id === params.wineTypeId ? optimisticWineType : wt)) || [])

      return { previousWineTypes, optimisticWineType, params }
    },

    onSuccess: (updatedWineType: WineType, _, context) => {
      if (!updatedWineType && context?.optimisticWineType) {
        return
      }

      if (updatedWineType) {
        const wineTypeWithColors = {
          ...updatedWineType,
          colors: updatedWineType.colors && updatedWineType.colors.length > 0 ? updatedWineType.colors : context?.optimisticWineType?.colors || [],
          translations: updatedWineType.translations || [],
        }

        queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => old?.map(wt => (wt.id === updatedWineType.id ? wineTypeWithColors : wt)) || [])
      }
    },

    onError: (_, __, context) => {
      if (context?.previousWineTypes) {
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], context.previousWineTypes)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })
    },
  })

  const deleteMutation = useMutation({
    ...wineTypeQueries.delete(),
    onMutate: async (wineTypeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })

      const previousWineTypes = queryClient.getQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'])
      const deletedWineType = previousWineTypes?.find(wt => wt.id === wineTypeId)
      queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], (old = []) => old?.filter(wt => wt.id !== wineTypeId) || [])

      return { previousWineTypes, deletedWineType }
    },

    onError: (_, __, context) => {
      if (context?.previousWineTypes) {
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', 'assigned-colors'], context.previousWineTypes)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list', 'assigned-colors'] })
    },
  })

  const createWineType = (wineType: CreateWineTypeRequest) => {
    return createMutation.mutateAsync(wineType)
  }

  const updateWineType = (params: UpdateWineTypeParams) => {
    return updateMutation.mutateAsync(params)
  }

  const deleteWineType = (wineTypeId: string) => {
    deleteMutation.mutateAsync(wineTypeId)
  }

  const searchWineType = (searchTerm: string) => {
    store.searchWineType(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentWineType = (wineType: WineType | null) => {
    store.setCurrentWineType(wineType)
  }

  const getWineTypeById = (id: string) => {
    return store.getWineTypeById(id)
  }

  const hasWineType = (id: string) => {
    return store.hasWineType(id)
  }

  return {
    // wineTypes: mockWineTypes,
    wineTypes: wineTypeQuery.data || [],
    searchResults: store.searchResults,
    currentWineType: store.currentWineType,

    isLoading: wineTypeQuery.isLoading,
    isError: wineTypeQuery.isError,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createWineType,
    updateWineType,
    deleteWineType,
    searchWineType,
    clearSearch,
    setCurrentWineType,
    getWineTypeById,
    hasWineType,

    refetchTastes: wineTypeQuery.refetch,
    refetchTastesWithParams: customRefetchGroups,
  }
}
