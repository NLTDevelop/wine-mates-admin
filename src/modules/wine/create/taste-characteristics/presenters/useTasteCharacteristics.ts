import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useWineTasteCharacteristicsStore } from '../entities/taste-characteristics-store'
import { BaseWineColor, NameDescriptionDictionary, ReorderItem } from '../../general/entities/types'
import { tasteCharacteristicsQueries } from '../entities/taste-characteristics-queries'
import { CreateTranslation, CreateWineTasteCharacteristicRequest, UpdateTranslation, UpdateWineTasteCharacteristicParams, WineTasteCharacteristics } from '../entities/taste-characteristics'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'

const convertCreateTranslations = (translations?: CreateTranslation[]): NameDescriptionDictionary[][] => {
  if (!translations) return []

  return [translations.map(trans => ({ ...trans, id: undefined }))]
}

const convertUpdateTranslations = (translations?: UpdateTranslation[]): NameDescriptionDictionary[][] => {
  if (!translations) return []

  return [translations.map(trans => ({ ...trans, id: trans.id }))]
}

export const useTasteCharacteristics = (cachedColors?: BaseWineColor[]) => {
  const queryClient = useQueryClient()
  const store = useWineTasteCharacteristicsStore()
  const { t } = useTranslation('wines')
  const { toast } = useToast()

  const tasteCharacteristicsQuery = useQuery({ ...tasteCharacteristicsQueries.list(['assigned-colors']) })

  const customRefetchGroups = (include?: string[]) => {
    return queryClient.fetchQuery(tasteCharacteristicsQueries.list(include))
  }

  useEffect(() => {
    if (cachedColors && cachedColors.length > 0) {
      queryClient.invalidateQueries({
        queryKey: ['taste-characteristics', 'list', 'assigned-colors'],
      })
    }
  }, [cachedColors, queryClient])

  useEffect(() => {
    if (tasteCharacteristicsQuery.data !== undefined) {
      store.setTasteCharacteristics(tasteCharacteristicsQuery.data)
    }
  }, [tasteCharacteristicsQuery.data, store])

  const createMutation = useMutation({
    ...tasteCharacteristicsQueries.create(),
    onMutate: async (newTasteCharacteristics: CreateWineTasteCharacteristicRequest) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })

      const assignedColors = cachedColors?.filter(color => newTasteCharacteristics.colorIds.includes(color.id)) || []

      const optimisticTranslations = convertCreateTranslations(newTasteCharacteristics.translations)

      const optimisticTasteCharacteristics: WineTasteCharacteristics = {
        id: `temp-${Date.now()}`,
        translations: optimisticTranslations,
        colors: assignedColors ?? [],
        colorHex: newTasteCharacteristics.colorHex,
        levels: [],
        sortNumber: 0,
        isPremium: false,
      }

      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], (old = []) => {
        const newData = [...old, optimisticTasteCharacteristics]
        return newData
      })

      return { optimisticTasteCharacteristics }
    },

    onSuccess: (newTasteCharacteristics: WineTasteCharacteristics, _, context) => {
      toast({
        title: t('taste_characteristics.characteristic_created'),
        variant: 'default',
      })
      if (context?.optimisticTasteCharacteristics) {
        const tasteCharacteristicsForApi = {
          ...newTasteCharacteristics,
          colors: newTasteCharacteristics.colors && newTasteCharacteristics.colors.length > 0 ? newTasteCharacteristics.colors : context.optimisticTasteCharacteristics.colors,
          translations: newTasteCharacteristics.translations || [],
        }
        queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], (old = []) =>
          old.map(tc => (tc.id === context.optimisticTasteCharacteristics.id ? tasteCharacteristicsForApi : tc))
        )
      }
    },
    onError: (_, __, context) => {
      if (context?.optimisticTasteCharacteristics) {
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], (old = []) => old.filter(tc => tc.id !== context.optimisticTasteCharacteristics.id))
      }
    },
  })

  const updateMutation = useMutation({
    ...tasteCharacteristicsQueries.update(),
    onMutate: async (params: UpdateWineTasteCharacteristicParams) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })

      const previousTasteCharacteristics = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'])

      const assignedColors = cachedColors?.filter(color => params.newCharacteristic.colorIds.includes(color.id)) || []

      const optimisticTranslations = convertUpdateTranslations(params.newCharacteristic.translations)

      const optimisticTasteCharacteristics: WineTasteCharacteristics = {
        id: params.characteristicId,
        translations: optimisticTranslations,
        colors: assignedColors,
        colorHex: params.newCharacteristic.colorHex,
        levels: params.newCharacteristic.levels,
        isPremium: false,
        sortNumber: params.newCharacteristic.sortNumber ?? 0,
      }

      queryClient.setQueryData<WineTasteCharacteristics[]>(
        ['taste-characteristics', 'list', 'assigned-colors'],
        (old = []) => old?.map(tc => (tc.id === params.characteristicId ? optimisticTasteCharacteristics : tc)) || []
      )

      return { previousTasteCharacteristics, optimisticTasteCharacteristics, params }
    },

    onSuccess: (updatedTasteCharacteristic: WineTasteCharacteristics, _, context) => {
      toast({
        title: t('taste_characteristics.characteristic_updated'),
        variant: 'default',
      })
      if (!updatedTasteCharacteristic && context?.optimisticTasteCharacteristics) {
        return
      }

      if (updatedTasteCharacteristic) {
        const tasteCharacteristicForApi = {
          ...updatedTasteCharacteristic,
          colors: updatedTasteCharacteristic.colors && updatedTasteCharacteristic.colors.length > 0 ? updatedTasteCharacteristic.colors : context?.optimisticTasteCharacteristics?.colors || [],
          translations: updatedTasteCharacteristic.translations || [],
        }

        queryClient.setQueryData<WineTasteCharacteristics[]>(
          ['taste-characteristics', 'list', 'assigned-colors'],
          (old = []) => old?.map(tc => (tc.id === updatedTasteCharacteristic.id ? tasteCharacteristicForApi : tc)) || []
        )
      }
    },

    onError: (_, __, context) => {
      if (context?.previousTasteCharacteristics) {
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], context.previousTasteCharacteristics)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })
    },
  })

  const deleteMutation = useMutation({
    ...tasteCharacteristicsQueries.delete(),
    onMutate: async (tasteCharacteristicId: string) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })

      const previousTasteCharacteristics = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'])
      const deletedTasteCharacteristic = previousTasteCharacteristics?.find(tc => tc.id === tasteCharacteristicId)

      store.deleteTasteCharacteristic(tasteCharacteristicId)
      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], (old = []) => old?.filter(tc => tc.id !== tasteCharacteristicId) || [])

      return { previousTasteCharacteristics, deletedTasteCharacteristic }
    },
    onSuccess: () => {
      toast({
        title: t('taste_characteristics.characteristic_deleted'),
        variant: 'default',
      })
    },
    onError: (_, __, context) => {
      if (context?.previousTasteCharacteristics) {
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], context.previousTasteCharacteristics)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })
    },
  })

  const reorderGroupMutation = useMutation({
    ...tasteCharacteristicsQueries.reorder(),

    onMutate: async (reorderParams: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })

      const previousGroups = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'])

      store.reorderTasteCharacteristics(reorderParams)

      const sortMap = new Map(reorderParams.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list', 'assigned-colors'], old => {
        if (!old) return old

        const updatedRows = old
          .map(group => {
            const newSortNumber = sortMap.get(Number(group.id))
            return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
          })
          .sort((a, b) => a.sortNumber - b.sortNumber)

        return updatedRows
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['taste-characteristics', 'list', 'assigned-colors'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })
    },
  })

  const reorderLevelMutation = useMutation({
    ...tasteCharacteristicsQueries.reorderLevel(),
    onMutate: async (items: ReorderItem[]) => {
      const key = ['taste-characteristics', 'list', 'assigned-colors']

      await queryClient.cancelQueries({ queryKey: key })

      const previousLevels = queryClient.getQueryData<WineTasteCharacteristics[]>(key)

      const sortMap = new Map(items.map(i => [i.id, i.sortNumber]))

      const updated = previousLevels?.map(group => {
        const newLevels = group.levels
          ?.map(level => ({
            ...level,
            sortNumber: sortMap.get(Number(level.id)) ?? level.sortNumber,
          }))
          .sort((a, b) => a.sortNumber - b.sortNumber)

        return {
          ...group,
          levels: newLevels,
        }
      })

      queryClient.setQueryData(key, updated)

      return { previousLevels }
    },

    onError: (_, __, context) => {
      if (context?.previousLevels) {
        queryClient.setQueryData(['taste-characteristics', 'list', 'assigned-colors'], context.previousLevels)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list', 'assigned-colors'] })
    },
  })

  const createTasteCharacteristics = (tasteCharacteristics: CreateWineTasteCharacteristicRequest) => {
    return createMutation.mutateAsync(tasteCharacteristics)
  }

  const updateTasteCharacteristics = (params: UpdateWineTasteCharacteristicParams) => {
    return updateMutation.mutateAsync(params)
  }

  const deleteTasteCharacteristics = (tasteCharacteristicsId: string) => {
    deleteMutation.mutateAsync(tasteCharacteristicsId)
  }

  const searchTasteCharacteristics = (searchTerm: string) => {
    store.searchTasteCharacteristics(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }

  const setCurrentTasteCharacteristics = (tasteCharacteristics: WineTasteCharacteristics | null) => {
    store.setCurrentTasteCharacteristic(tasteCharacteristics)
  }

  return {
    tasteCharacteristics: tasteCharacteristicsQuery.data || [],
    searchResults: store.searchResults,
    currentTasteCharacteristics: store.currentTasteCharacteristic,

    isLoading: tasteCharacteristicsQuery.isLoading,
    isError: tasteCharacteristicsQuery.isError,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReorderingGroup: reorderGroupMutation.isPending,

    createTasteCharacteristics,
    updateTasteCharacteristics,
    deleteTasteCharacteristics,
    searchTasteCharacteristics,
    clearSearch,
    setCurrentTasteCharacteristics,

    refetchTastes: tasteCharacteristicsQuery.refetch,
    refetchTastesWithParams: customRefetchGroups,
    reorderGroup: reorderGroupMutation.mutateAsync,
    reorderLevels: reorderLevelMutation.mutateAsync,
  }
}
