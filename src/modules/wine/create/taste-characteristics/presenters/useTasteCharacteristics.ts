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

  const tasteCharacteristicsQuery = useQuery({ ...tasteCharacteristicsQueries.list() })

  const customRefetchGroups = () => {
    return queryClient.fetchQuery(tasteCharacteristicsQueries.list())
  }

  useEffect(() => {
    if (cachedColors && cachedColors.length > 0) {
      queryClient.invalidateQueries({
        queryKey: ['taste-characteristics', 'list'],
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
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list'] })

      const optimisticTranslations = convertCreateTranslations(newTasteCharacteristics.translations)

      const optimisticTasteCharacteristics: WineTasteCharacteristics = {
        id: `temp-${Date.now()}`,
        translations: optimisticTranslations,
        colorHex: newTasteCharacteristics.colorHex,
        levels: [],
        sortNumber: 0,
        isPremium: false,
        qtyLevels: newTasteCharacteristics.qtyLevels,
      }

      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], (old = []) => {
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
          translations: newTasteCharacteristics.translations || [],
        }
        queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], (old = []) =>
          old.map(tc => (tc.id === context.optimisticTasteCharacteristics.id ? tasteCharacteristicsForApi : tc))
        )
      }
    },
    onError: (_, __, context) => {
      if (context?.optimisticTasteCharacteristics) {
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], (old = []) => old.filter(tc => tc.id !== context.optimisticTasteCharacteristics.id))
      }
    },
  })

  const updateMutation = useMutation({
    ...tasteCharacteristicsQueries.update(),
    onMutate: async (params: UpdateWineTasteCharacteristicParams) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list'] })

      const previousTasteCharacteristics = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'])

      const optimisticTranslations = convertUpdateTranslations(params.newCharacteristic.translations)

      const optimisticTasteCharacteristics: WineTasteCharacteristics = {
        id: params.characteristicId,
        translations: optimisticTranslations,
        colorHex: params.newCharacteristic.colorHex,
        levels: params.newCharacteristic.levels,
        isPremium: false,
        sortNumber: params.newCharacteristic.sortNumber ?? 0,
        qtyLevels: params.newCharacteristic.qtyLevels ?? '',
      }

      queryClient.setQueryData<WineTasteCharacteristics[]>(
        ['taste-characteristics', 'list'],
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
          translations: updatedTasteCharacteristic.translations || [],
        }

        queryClient.setQueryData<WineTasteCharacteristics[]>(
          ['taste-characteristics', 'list'],
          (old = []) => old?.map(tc => (tc.id === updatedTasteCharacteristic.id ? tasteCharacteristicForApi : tc)) || []
        )
      }
    },

    onError: (_, __, context) => {
      if (context?.previousTasteCharacteristics) {
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], context.previousTasteCharacteristics)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const deleteMutation = useMutation({
    ...tasteCharacteristicsQueries.delete(),
    onMutate: async (tasteCharacteristicId: string) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list'] })

      const previousTasteCharacteristics = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'])
      const deletedTasteCharacteristic = previousTasteCharacteristics?.find(tc => tc.id === tasteCharacteristicId)

      store.deleteTasteCharacteristic(tasteCharacteristicId)
      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], (old = []) => old?.filter(tc => tc.id !== tasteCharacteristicId) || [])

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
        queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], context.previousTasteCharacteristics)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const reorderGroupMutation = useMutation({
    ...tasteCharacteristicsQueries.reorder(),

    onMutate: async (reorderParams: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['taste-characteristics', 'list'] })

      const previousGroups = queryClient.getQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'])

      store.reorderTasteCharacteristics(reorderParams)

      const sortMap = new Map(reorderParams.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData<WineTasteCharacteristics[]>(['taste-characteristics', 'list'], old => {
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
        queryClient.setQueryData(['taste-characteristics', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
    },
  })

  const reorderLevelMutation = useMutation({
    ...tasteCharacteristicsQueries.reorderLevel(),
    onMutate: async (items: ReorderItem[]) => {
      const key = ['taste-characteristics', 'list']

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
        queryClient.setQueryData(['taste-characteristics', 'list'], context.previousLevels)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-characteristics', 'list'] })
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
