import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useTasteStore } from '../entities/wine-taste-store'
import { tasteQueries } from '../entities/wine-taste-queries'
import { CreateWineTasteRequest, UpdateWineTasteParams, WineTaste } from '../entities/types/tastes'
import { tasteService } from '../entities/wine-taste-service'
import { BaseWineColor, DataResponse } from '../../general/entities/types'

export const useWineTaste = (cachedColors?: BaseWineColor[]) => {
  const queryClient = useQueryClient()
  const store = useTasteStore()

  const stableFilters = useMemo(() => {
    const filtersWithSubAromas = {
      ...store.filters,
      include: Array.from(new Set([...(store.filters.include || []), 'assigned-colors'])),
    }
    return JSON.stringify(filtersWithSubAromas)
  }, [store.filters])

  const tastesQuery: UseQueryResult<DataResponse<WineTaste>, Error> = useQuery({
    queryKey: ['tastes', 'list', stableFilters],
    queryFn: () =>
      tasteService.list({
        ...store.filters,
        include: ['assigned-colors'],
      }),
    placeholderData: prev => prev,
  })

  useEffect(() => {
    if (!tastesQuery.data || tastesQuery.isFetching) return
    store.setTastes(tastesQuery.data.rows)
  }, [tastesQuery.data, tastesQuery.isFetching])

  const createTasteMutation = useMutation({
    ...tasteQueries.create(),
    onMutate: async (newWineTaste: CreateWineTasteRequest) => {
      await queryClient.cancelQueries({ queryKey: ['tastes', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters])
      const assignedColors = cachedColors?.filter(color => newWineTaste.colorIds.includes(color.id)) || []
      const optimisticWineTaste: WineTaste = {
        id: `temp-${Date.now()}`,
        translations: newWineTaste.translations ?? [],
        colorHex: newWineTaste.colorHex ?? '',
        colors: assignedColors ?? [],
      }

      queryClient.setQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters], old => {
        if (!old) {
          return { rows: [optimisticWineTaste], count: 1 }
        }

        return {
          rows: [...old.rows, optimisticWineTaste],
          count: old.count + 1,
        }
      })

      return { prev, tempId: optimisticWineTaste.id }
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['tastes', 'list', stableFilters], context.prev)
      }
    },

    onSuccess: (newWineTaste: WineTaste, _, context) => {
      queryClient.setQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters], old => {
        if (!old) return { rows: [newWineTaste], count: 1 }

        return {
          rows: old.rows.map(taste => (taste.id === context?.tempId ? newWineTaste : taste)),
          count: old.count,
        }
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const updateTasteMutation = useMutation({
    ...tasteQueries.update(),
    onMutate: async (params: UpdateWineTasteParams) => {
      await queryClient.cancelQueries({ queryKey: ['tastes', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters])

      const assignedColors = cachedColors?.filter(color => params.newTaste.colorIds.includes(color.id)) || []

      const optimisticWineTaste: WineTaste = {
        id: params.tasteId,
        translations: params.newTaste.translations,
        colorHex: params.newTaste.colorHex,
        colors: assignedColors,
      }

      queryClient.setQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters], old => {
        if (!old) {
          return { rows: [optimisticWineTaste], count: 1 }
        }

        return {
          rows: old.rows.map(wt => (wt.id === params.tasteId ? optimisticWineTaste : wt)),
          count: old.count,
        }
      })

      return { prev }
    },

    onError: (error, _, context) => {
      console.error('Failed to update taste:', error)
      if (context?.prev) {
        queryClient.setQueryData(['tastes', 'list', stableFilters], context.prev)
      }
    },

    onSuccess: (updatedTaste: WineTaste) => {
      queryClient.setQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters], old => {
        if (!old) return { rows: [updatedTaste], count: 1 }

        const tasteWithColors = {
          ...updatedTaste,
          colors: updatedTaste.colors && updatedTaste.colors.length > 0 ? updatedTaste.colors : old.rows.find(t => t.id === updatedTaste.id)?.colors || [],
          translations: updatedTaste.translations || [],
        }

        return {
          rows: old.rows.map(wt => (wt.id === updatedTaste.id ? tasteWithColors : wt)),
          count: old.count,
        }
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const deleteTasteMutation = useMutation({
    ...tasteQueries.delete(),
    onMutate: async (wineTasteId: string) => {
      await queryClient.cancelQueries({ queryKey: ['tastes', 'list', stableFilters] })

      const prev = queryClient.getQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters])
      const deletedTaste = prev?.rows?.find(wt => wt.id === wineTasteId)

      queryClient.setQueryData<DataResponse<WineTaste>>(['tastes', 'list', stableFilters], old => {
        if (!old) {
          return { rows: [], count: 0 }
        }

        return {
          rows: old.rows.filter(t => t.id !== wineTasteId),
          count: Math.max(old.count - 1, 0),
        }
      })

      return { prev, deletedTaste }
    },

    onError: (error, _, context) => {
      console.error('Failed to delete taste:', error)
      if (context?.prev) {
        queryClient.setQueryData(['tastes', 'list', stableFilters], context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const createTaste = (taste: CreateWineTasteRequest) => {
    return createTasteMutation.mutateAsync(taste)
  }

  const updateTaste = (params: UpdateWineTasteParams) => {
    return updateTasteMutation.mutateAsync(params)
  }

  const deleteTaste = (tasteId: string) => {
    return deleteTasteMutation.mutateAsync(tasteId)
  }

  const searchTastes = (searchTerm: string) => {
    store.searchTastes(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentTaste = (taste: WineTaste | null) => {
    store.setCurrentTaste(taste)
  }

  const getTasteById = (id: string) => {
    return store.getTasteById(id)
  }

  const getTasteByValue = (value: string) => {
    return store.getTasteByValue(value)
  }

  const hasTaste = (id: string) => {
    return store.hasTaste(id)
  }

  const hasTasteByValue = (value: string) => {
    return store.hasTasteByValue(value)
  }

  return {
    tastes: tastesQuery.data?.rows || [],
    searchResults: store.searchResults,
    currentTaste: store.currentTaste,
    totalCount: tastesQuery.data?.count || 0,
    filters: store.filters,
    onChangePagination: (page: number) => store.setFilters({ page }),

    isLoading: tastesQuery.isLoading,
    isError: tastesQuery.isError,
    error: tastesQuery.error,

    isCreating: createTasteMutation.isPending,
    isUpdating: updateTasteMutation.isPending,
    isDeleting: deleteTasteMutation.isPending,

    createTaste,
    updateTaste,
    deleteTaste,
    searchTastes,
    clearSearch,
    setCurrentTaste,
    getTasteById,
    getTasteByValue,
    hasTaste,
    hasTasteByValue,

    refetchTastes: tastesQuery.refetch,
    tastesQuery,
  }
}
