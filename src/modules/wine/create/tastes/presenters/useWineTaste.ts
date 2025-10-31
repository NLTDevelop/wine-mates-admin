import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTasteStore } from '../entities/wine-taste-store'
import { tasteQueries } from '../entities/wine-taste-queries'
import { CreateWineTasteParams, UpdateWineTasteParams, WineTaste } from '../entities/types/tastes'


export const useWineTaste = () => {
  const queryClient = useQueryClient()
  const store = useTasteStore()

  const tastesQuery = useQuery({
    ...tasteQueries.list(),
  })

  useEffect(() => {
    if (tastesQuery.data) {
      store.setTastes(tastesQuery.data)
    }
  }, [tastesQuery.data, store])

  const createTasteMutation = useMutation({
    ...tasteQueries.create(),
    onSuccess: newTaste => {
      store.addTaste(newTaste)
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const updateTasteMutation = useMutation({
    ...tasteQueries.update(),
    onSuccess: updatedTaste => {
      store.updateTaste(updatedTaste.id, updatedTaste)
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const deleteTasteMutation = useMutation({
    ...tasteQueries.delete(),
    onSuccess: (_, tasteId) => {
      store.deleteTaste(tasteId)
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const createTaste = (taste: CreateWineTasteParams) => {
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
    tastes: store.tastes,
    searchResults: store.searchResults,
    currentTaste: store.currentTaste,

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