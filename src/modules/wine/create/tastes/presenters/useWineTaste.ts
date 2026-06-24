import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { DataResponse, ReorderItem } from '../../general/entities/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useWineTasteStore } from '../entities/wine-taste-store'
import { CreateWineTasteGroupRequest, CreateWineTasteParams, UpdateWineTasteGroupParams, WineTasteGroup, WineTasteItem } from '../entities/types/tastes'
import { tasteService } from '../entities/wine-taste-service'
import { wineTasteQueries } from '../entities/wine-taste-queries'

export const useWineTaste = () => {
  const queryClient = useQueryClient()
  const store = useWineTasteStore()
  const { t } = useTranslation('wines')
  const { toast } = useToast()

  const groupsQuery: UseQueryResult<WineTasteGroup[], Error> = useQuery({
    queryKey: ['taste-groups', 'list'],
    queryFn: () => tasteService.listGroups(),
    placeholderData: prev => prev,
  })

  useEffect(() => {
    if (!groupsQuery.data || groupsQuery.isFetching) return
    store.setTasteGroups(groupsQuery.data)
  }, [groupsQuery.data, groupsQuery.isFetching])

  const tasteGroups = (): WineTasteGroup[] => {
    const cached = queryClient.getQueryData<WineTasteGroup[]>(['taste-groups', 'list'])
    return cached ?? []
  }

  const createGroupMutation = useMutation({
    ...wineTasteQueries.createGroup(),

    onMutate: async (groupData: CreateWineTasteGroupRequest) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })
      const prev = queryClient.getQueryData<DataResponse<WineTasteGroup>>(['taste-groups', 'list'])

      const tempGroup: WineTasteGroup = {
        id: 'temp-id-' + Date.now(),
        ...groupData,
        sortNumber: 0,
      }

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => {
        const newData = [...old, tempGroup]
        return newData
      })

      return { prev, tempGroup }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSuccess: (newGroup: WineTasteGroup, _, ctx) => {
      toast({
        title: t('tastes.tastes_group_created'),
        variant: 'default',
      })

      if (ctx?.tempGroup) {
        const finalId = newGroup?.id || ctx.tempGroup.id

        const finalWineTaste = {
          ...ctx.tempGroup,
          id: finalId,
        }
        queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
        queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => old.map(wt => (wt.id === ctx.tempGroup.id ? finalWineTaste : wt)))
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'], exact: false })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineTasteQueries.updateGroup(),

    onMutate: async (params: UpdateWineTasteGroupParams) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })
      const prev = queryClient.getQueryData<WineTasteGroup[]>(['taste-groups', 'list'])

      const currentGroup = prev?.find(g => g.id === params.groupId)

      const optimistic: WineTasteGroup = {
        id: params.groupId,
        translations: params.newGroup.translations,
        colorHex: params.newGroup.colorHex,
        sortNumber: currentGroup?.sortNumber || 0,
      }

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => old?.map(g => (g.id === params.groupId ? optimistic : g)) || [])

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('tastes.taste_group_updated'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'], exact: false })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineTasteQueries.deleteGroup(),

    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineTasteGroup>>(['taste-groups', 'list'])

      store.deleteTasteGroup(groupId)

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => old?.filter(g => g.id !== groupId) || [])

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('tastes.taste_group_deleted'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'], exact: false })
    },
  })

  const reorderGroupMutation = useMutation({
    ...wineTasteQueries.reorderGroup(),

    onMutate: async (reorderParams: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const previousGroups = queryClient.getQueryData<WineTasteGroup[]>(['taste-groups', 'list'])

      store.reorderTasteGroups(reorderParams)

      const sortMap = new Map(reorderParams.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], old => {
        if (!old) return old

        const updatedRows = old
          ?.map(group => {
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
        queryClient.setQueryData(['taste-groups', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
    },
  })

  const createTaste = useMutation({
    ...wineTasteQueries.createTaste(),

    onMutate: async ({ groupId, tasteData }: { groupId: string; tasteData: CreateWineTasteParams }) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const prev = queryClient.getQueryData<DataResponse<WineTasteGroup>>(['taste-groups', 'list'])

      const tempTaste: WineTasteItem = {
        id: 'temp-id-' + Date.now(),
        translations: tasteData.translations ?? [],
        sortNumber: tasteData.sortNumber ?? 0,
        groupId: parseInt(groupId),
        colorHex: tasteData.colorHex ?? '',
      }

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => {
        return old.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              flavors: [...(group.flavors || []), tempTaste],
            }
          }
          return group
        })
      })

      return { prev, tempTaste, groupId }
    },

    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSuccess: (newTaste, _, ctx) => {
      toast({
        title: t('tastes.taste_created'),
        variant: 'default',
      })
      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], (old = []) => {
        return old.map(group => {
          if (group.id === ctx?.groupId) {
            const filteredFlavors = (group.flavors || []).filter(t => t.id !== ctx?.tempTaste?.id)
            return {
              ...group,
              flavors: [...filteredFlavors, newTaste],
            }
          }
          return group
        })
      })
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
    },
  })

  const updateTaste = useMutation({
    ...wineTasteQueries.updateTaste(),

    onMutate: async ({ groupId }: any) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const prev = queryClient.getQueryData<WineTasteGroup[]>(['taste-groups', 'list'])

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], old => {
        if (!old) return []

        return old.map(g => (g.id === groupId ? { ...g, flavor: g?.flavors?.map(f => f) } : g))
      })

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('tastes.taste_updated'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
    },
  })

  const deleteTaste = useMutation({
    ...wineTasteQueries.deleteTaste(),

    onMutate: async ({ groupId, tasteId }) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const prev = queryClient.getQueryData<WineTasteGroup[]>(['taste-groups', 'list'])

      queryClient.setQueryData<WineTasteGroup[]>(['taste-groups', 'list'], old => {
        if (!old) return []

        return old.map(g => (g.id === groupId ? { ...g, flavors: g?.flavors?.filter(s => s.id !== tasteId) } : g))
      })

      return { prev }
    },
    onSuccess: () => {
      toast({
        title: t('tastes.taste_deleted'),
        variant: 'default',
      })
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['taste-groups', 'list'], ctx.prev)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
    },
  })

  const reorderTasteMutation = useMutation({
    ...wineTasteQueries.reorderTaste(),
    onMutate: async (items: ReorderItem[]) => {
      await queryClient.cancelQueries({ queryKey: ['taste-groups', 'list'] })

      const previousGroups = queryClient.getQueryData(['taste-groups', 'list'])

      const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

      queryClient.setQueryData(['taste-groups', 'list'], (old: any) => {
        if (!old) return old

        const updatedRows = old.map((group: WineTasteGroup) => {
          const updatedFlavors =
            group.flavors
              ?.map(f => {
                const newSortNumber = sortMap.get(parseInt(f.id))
                return newSortNumber !== undefined ? { ...f, sortNumber: newSortNumber } : f
              })
              .sort((a: any, b: any) => a.sortNumber - b.sortNumber) || []

          return {
            ...group,
            flavors: updatedFlavors,
          }
        })

        return updatedRows
      })

      return { previousGroups }
    },

    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(['taste-groups', 'list'], context.previousGroups)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['taste-groups', 'list'] })
    },
  })

  const onChangePagination = (page: number) => store.setFilters({ page })

  return {
    tasteGroups: tasteGroups(),

    filters: store.filters,
    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isReorderingGroup: reorderGroupMutation.isPending,
    isCreatingTaste: createTaste.isPending,
    isUpdatingTaste: updateTaste.isPending,
    isDeletingTaste: deleteTaste.isPending,

    createGroup: createGroupMutation.mutateAsync,
    updateGroup: updateGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    reorderGroup: reorderGroupMutation.mutateAsync,
    createTaste: createTaste.mutateAsync,
    updateTaste: updateTaste.mutateAsync,
    deleteTaste: deleteTaste.mutateAsync,
    reorderTaste: reorderTasteMutation.mutateAsync,

    onChangePagination,
    refetchGroups: groupsQuery.refetch,
  }
}
