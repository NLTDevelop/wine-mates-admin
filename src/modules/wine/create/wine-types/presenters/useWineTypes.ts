import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineTypeRequest, UpdateWineTypeParams, WineType, WineTypeResponse } from '../entities/types/wine-type'
import { useWineTypeStore } from '../entities/wine-type-store'
import { WineTypeFilters, wineTypeQueries } from '../entities/wine-type-queries'
import { BaseWineColor } from '../../general/entities/types'

export const useWineTypes = (cachedColors?: BaseWineColor[]) => {
  const queryClient = useQueryClient()
  const store = useWineTypeStore()

  const wineTypeQuery: UseQueryResult<WineTypeResponse, Error> = useQuery({
    ...wineTypeQueries.list({
      limit: store.filters.limit,
      offset: store.filters.offset,
      search: store.filters.search,
      include: ['assigned-colors'],
    }),
  })

  const customRefetchGroups = (filters?: WineTypeFilters) => {
    return queryClient.fetchQuery(wineTypeQueries.list(filters))
  }

  useEffect(() => {
    if (wineTypeQuery.data?.rows !== undefined) {
      store.setWineTypes(wineTypeQuery.data.rows)
    }
  }, [wineTypeQuery.data?.rows, store])

  const createMutation = useMutation({
    ...wineTypeQueries.create(),
    onMutate: async (newWineType: CreateWineTypeRequest) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list'] })

      const assignedColors = cachedColors?.filter(color => newWineType.colorIds.includes(color.id)) || []
      const optimisticWineType: WineType = {
        id: `temp-${Date.now()}`,
        nameUa: newWineType.nameUa,
        nameEn: newWineType.nameEn,
        colors: assignedColors,
      }

      queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => {
        const newData = {
          rows: [...old.rows, optimisticWineType],
          count: old.count + 1,
        }
        return newData
      })

      return { optimisticWineType }
    },

    onSuccess: (newWineType: WineType, _, context) => {
      if (context?.optimisticWineType) {
        const wineTypeWithColors = {
          ...newWineType,
          colors: newWineType.colors && newWineType.colors.length > 0 ? newWineType.colors : context.optimisticWineType.colors,
        }

        queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => ({
          rows: old.rows.map((wt: WineType) => (wt.id === context.optimisticWineType.id ? wineTypeWithColors : wt)),
          count: old.count,
        }))
      }
    },
    onError: (_, __, context) => {
      if (context?.optimisticWineType) {
        queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => ({
          rows: old.rows.filter((wt: WineType) => wt.id !== context.optimisticWineType.id),
          count: old.count - 1,
        }))
      }
    },
  })

  const updateMutation = useMutation({
    ...wineTypeQueries.update(),
    onMutate: async (params: UpdateWineTypeParams) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list'] })

      const previousWineTypes = queryClient.getQueryData<WineType[]>(['wine-types', 'list', store.filters])

      const assignedColors = cachedColors?.filter(color => params.newWineType.colorIds.includes(color.id)) || []

      const optimisticWineType: WineType = {
        id: params.wineTypeId,
        nameUa: params.newWineType.nameUa,
        nameEn: params.newWineType.nameEn,
        colors: assignedColors,
      }

      queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => ({
        rows: old.rows?.map((wt: WineType) => (wt.id === params.wineTypeId ? optimisticWineType : wt)) || [],
        count: old.count,
      }))

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
        }

        queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => ({
          rows: old.rows?.map((wt: WineType) => (wt.id === updatedWineType.id ? wineTypeWithColors : wt)) || [],
          count: old.count,
        }))
      }
    },

    onError: (_, __, context) => {
      if (context?.previousWineTypes) {
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', store.filters], context.previousWineTypes)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
    },
  })

  const deleteMutation = useMutation({
    ...wineTypeQueries.delete(),
    onMutate: async (wineTypeId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wine-types', 'list'] })

      const previousWineTypes = queryClient.getQueryData<WineType[]>(['wine-types', 'list', store.filters])
      const deletedWineType = previousWineTypes?.find(wt => wt.id === wineTypeId)
      queryClient.setQueryData<WineTypeResponse>(['wine-types', 'list', store.filters], (old: WineTypeResponse = { rows: [], count: 0 }) => ({
        rows: old.rows?.filter((wt: WineType) => wt.id !== wineTypeId) || [],
        count: old.count - 1,
      }))

      return { previousWineTypes, deletedWineType }
    },

    onError: (_, __, context) => {
      if (context?.previousWineTypes) {
        queryClient.setQueryData<WineType[]>(['wine-types', 'list', store.filters], context.previousWineTypes)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
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

  const onChangePagination = (offset: number) => {
    store.setFilters({ offset })
  }

  return {
    wineTypes: wineTypeQuery?.data?.rows || [],
    searchResults: store.searchResults,
    currentWineType: store.currentWineType,
    totalCount: wineTypeQuery?.data?.count || 0,
    filters: store.filters,

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
    onChangePagination,

    refetchTastes: wineTypeQuery.refetch,
    refetchTastesWithParams: customRefetchGroups,
    wineTypeQuery,
  }
}
