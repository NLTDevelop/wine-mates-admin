import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineTasteCharacteristicParams, UpdateWineTasteCharacteristicParams, WineTasteCharacteristics, LevelItem, UpdateWineTasteItemParams } from '../entities/types/taste-characteristics'
import { useWineTasteCharacteristicsStore } from '../entities/taste-characteristics-store'
import { tasteCharacteristicsQueries } from '../entities/taste-characteristics-queries'

export const useWineTasteCharacteristics = () => {
  const queryClient = useQueryClient()
  const store = useWineTasteCharacteristicsStore()

  const characteristicsQuery = useQuery({
    ...tasteCharacteristicsQueries.listCharacteristics(),
  })

  useEffect(() => {
    if (characteristicsQuery.data) {
      store.setTasteCharacteristics(characteristicsQuery.data)
    }
  }, [characteristicsQuery.data, store])

  const createCharacteristicMutation = useMutation({
    ...tasteCharacteristicsQueries.createCharacteristic(),
    onSuccess: newCharacteristic => {
      store.addTasteCharacteristic(newCharacteristic)
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const updateCharacteristicMutation = useMutation({
    ...tasteCharacteristicsQueries.updateCharacteristic(),
    onSuccess: updatedCharacteristic => {
      store.updateTasteCharacteristic(updatedCharacteristic.id, updatedCharacteristic)
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const deleteCharacteristicMutation = useMutation({
    ...tasteCharacteristicsQueries.deleteCharacteristic(),
    onSuccess: (_, characteristicId) => {
      store.deleteTasteCharacteristic(characteristicId)
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const updateCharacteristicLevelsMutation = useMutation({
    mutationKey: ['taste-characteristics', 'update-levels'],
    mutationFn: async (params: { characteristicId: string; levels: LevelItem[] }) => {
      const updateParams: UpdateWineTasteCharacteristicParams  = {
        characteristicId: params.characteristicId,
        newCharacteristic: {
          levels: params.levels,
        },
      }

      return updateCharacteristicMutation.mutateAsync(updateParams)
    },
    onSuccess: updatedCharacteristic => {
      store.updateCharacteristicLevels(updatedCharacteristic.id, updatedCharacteristic.levels || [])
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const addCharacteristicLevelMutation = useMutation({
    mutationKey: ['taste-characteristics', 'add-level'],
    mutationFn: async (params: { characteristicId: string; level: LevelItem }) => {
      const characteristic = store.getTasteCharacteristicById(params.characteristicId)
      if (!characteristic) throw new Error('Characteristic not found')

      const updatedLevels = [...(characteristic.levels || []), params.level]
      const updateParams: UpdateWineTasteCharacteristicParams = {
        characteristicId: params.characteristicId,
        newCharacteristic: {
          levels: updatedLevels,
        },
      }

      return updateCharacteristicMutation.mutateAsync(updateParams)
    },
    onSuccess: updatedCharacteristic => {
      store.updateCharacteristicLevels(updatedCharacteristic.id, updatedCharacteristic.levels || [])
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const updateCharacteristicLevelMutation = useMutation({
    mutationKey: ['taste-characteristics', 'update-level'],
    mutationFn: async (params: { characteristicId: string; levelId: string; updatedLevel: LevelItem }) => {
      const characteristic = store.getTasteCharacteristicById(params.characteristicId)
      if (!characteristic) throw new Error('Characteristic not found')

      const updatedLevels = characteristic.levels?.map(level => (level.id === params.levelId ? params.updatedLevel : level)) || []

      const updateParams: UpdateWineTasteCharacteristicParams = {
        characteristicId: params.characteristicId,
        newCharacteristic: {
          levels: updatedLevels,
        },
      }

      return updateCharacteristicMutation.mutateAsync(updateParams)
    },
    onSuccess: updatedCharacteristic => {
      store.updateCharacteristicLevels(updatedCharacteristic.id, updatedCharacteristic.levels || [])
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const deleteCharacteristicLevelMutation = useMutation({
    mutationKey: ['taste-characteristics', 'delete-level'],
    mutationFn: async (params: { characteristicId: string; levelId: string }) => {
      const characteristic = store.getTasteCharacteristicById(params.characteristicId)
      if (!characteristic) throw new Error('Characteristic not found')

      const updatedLevels = characteristic.levels?.filter(level => level.id !== params.levelId) || []

      const updateParams: UpdateWineTasteCharacteristicParams = {
        characteristicId: params.characteristicId,
        newCharacteristic: {
          levels: updatedLevels,
        },
      }

      return updateCharacteristicMutation.mutateAsync(updateParams)
    },
    onSuccess: updatedCharacteristic => {
      store.updateCharacteristicLevels(updatedCharacteristic.id, updatedCharacteristic.levels || [])
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const reorderCharacteristicLevelsMutation = useMutation({
    mutationKey: ['taste-characteristics', 'reorder-levels'],
    mutationFn: async (params: { characteristicId: string; levelIds: string[] }) => {
      const characteristic = store.getTasteCharacteristicById(params.characteristicId)
      if (!characteristic) throw new Error('Characteristic not found')

      const levelMap = new Map(characteristic.levels?.map(level => [level.id, level]) || [])
      const reorderedLevels = params.levelIds.map(id => levelMap.get(id)).filter(Boolean) as LevelItem[]
      const levelsWithUpdatedOrder = reorderedLevels.map((level, index) => ({
        ...level,
        order: index,
      }))

      const updateParams: UpdateWineTasteCharacteristicParams = {
        characteristicId: params.characteristicId,
        newCharacteristic: {
          levels: levelsWithUpdatedOrder,
        },
      }

      return updateCharacteristicMutation.mutateAsync(updateParams)
    },
    onSuccess: updatedCharacteristic => {
      store.reorderCharacteristicLevels(updatedCharacteristic.id, updatedCharacteristic.levels?.map(l => l.id) || [])
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const createCharacteristic = (characteristic: CreateWineTasteCharacteristicParams) => {
    return createCharacteristicMutation.mutateAsync(characteristic)
  }

  const updateCharacteristic = (params: UpdateWineTasteCharacteristicParams) => {
    return updateCharacteristicMutation.mutateAsync(params)
  }

  const deleteCharacteristic = (characteristicId: string) => {
    return deleteCharacteristicMutation.mutateAsync(characteristicId)
  }

  const updateCharacteristicLevels = (characteristicId: string, levels: LevelItem[]) => {
    return updateCharacteristicLevelsMutation.mutateAsync({ characteristicId, levels })
  }

  const addCharacteristicLevel = (characteristicId: string, level: LevelItem) => {
    return addCharacteristicLevelMutation.mutateAsync({ characteristicId, level })
  }

  const updateCharacteristicLevel = (characteristicId: string, levelId: string, updatedLevel: LevelItem) => {
    return updateCharacteristicLevelMutation.mutateAsync({ characteristicId, levelId, updatedLevel })
  }

  const deleteCharacteristicLevel = (characteristicId: string, levelId: string) => {
    return deleteCharacteristicLevelMutation.mutateAsync({ characteristicId, levelId })
  }

  const reorderCharacteristicLevels = (characteristicId: string, levelIds: string[]) => {
    return reorderCharacteristicLevelsMutation.mutateAsync({ characteristicId, levelIds })
  }

  const searchTasteCharacteristics = (searchTerm: string) => {
    store.searchTasteCharacteristics(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentTasteCharacteristic = (characteristic: WineTasteCharacteristics | null) => {
    store.setCurrentTasteCharacteristic(characteristic)
  }

  const getTasteCharacteristicById = (id: string) => {
    return store.getTasteCharacteristicById(id)
  }

  const getTasteCharacteristicByLabel = (label: string) => {
    return store.getTasteCharacteristicByLabel(label)
  }

  const hasTasteCharacteristic = (id: string) => {
    return store.hasTasteCharacteristic(id)
  }

  const hasTasteCharacteristicByLabel = (label: string) => {
    return store.hasTasteCharacteristicByLabel(label)
  }

  return {
    tasteCharacteristics: store.tasteCharacteristics,
    searchResults: store.searchResults,
    currentTasteCharacteristic: store.currentTasteCharacteristic,

    isLoading: characteristicsQuery.isLoading,
    isError: characteristicsQuery.isError,
    error: characteristicsQuery.error,

    isCreatingCharacteristic: createCharacteristicMutation.isPending,
    isUpdatingCharacteristic: updateCharacteristicMutation.isPending,
    isDeletingCharacteristic: deleteCharacteristicMutation.isPending,
    isUpdatingCharacteristicLevels: updateCharacteristicLevelsMutation.isPending,
    isAddingCharacteristicLevel: addCharacteristicLevelMutation.isPending,
    isUpdatingCharacteristicLevel: updateCharacteristicLevelMutation.isPending,
    isDeletingCharacteristicLevel: deleteCharacteristicLevelMutation.isPending,
    isReorderingCharacteristicLevels: reorderCharacteristicLevelsMutation.isPending,

    createCharacteristic,
    updateCharacteristic,
    deleteCharacteristic,
    updateCharacteristicLevels,
    addCharacteristicLevel,
    updateCharacteristicLevel,
    deleteCharacteristicLevel,
    reorderCharacteristicLevels,
    searchTasteCharacteristics,
    clearSearch,
    setCurrentTasteCharacteristic,
    getTasteCharacteristicById,
    getTasteCharacteristicByLabel,
    hasTasteCharacteristic,
    hasTasteCharacteristicByLabel,

    refetchCharacteristics: characteristicsQuery.refetch,

    characteristicsQuery,
  }
}
