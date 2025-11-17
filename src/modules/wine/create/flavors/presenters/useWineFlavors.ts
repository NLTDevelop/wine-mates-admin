import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'
import { CreateWineAromaGroupParams, UpdateWineAromaGroupParams, CreateWineAromaSubgroupParams, UpdateWineAromaSubgroupParams, WineAromaGroup, WineAromaSubgroup } from '../entities/types/flavor-types'
import { useWineFlavorStore } from '../entities/wine-flavor-store'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'
import { DataResponse } from '../../general/entities/types'
import { FiltersParams } from '@/lib/client-pagination'

interface DeleteSubgroupParams {
  subgroupId: string
  groupId: string
}

export const useWineFlavor = () => {
  const queryClient = useQueryClient()
  const store = useWineFlavorStore()

  const groupsQuery: UseQueryResult<DataResponse<WineAromaGroup>, Error> = useQuery({
    // ...wineFlavorQueries.listGroups(['subgroups', 'assigned-colors']),
    ...wineFlavorQueries.listGroups({
      limit: store.filters.limit,
      offset: store.filters.offset,
      search: store.filters.search,
      include: ['subgroups', 'assigned-colors'],
    }),
  })

 const getCurrentAromaGroups = (): DataResponse<WineAromaGroup> => {
  const data = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters])
  return data || { rows: [], count: 0 }
}

  const customRefetchGroups = (/*include?: string[]*/ filters?: FiltersParams) => {
    return queryClient.fetchQuery(wineFlavorQueries.listGroups(/*include*/ filters || store.filters))
  }

  // useEffect(() => {
  //   if (groupsQuery.data) {
  //     store.setAromaGroups(groupsQuery.data)
  //   }
  // }, [groupsQuery.data, store])

  const createGroupMutation = useMutation({
    ...wineFlavorQueries.createGroup(),
    onMutate: async (newColor: CreateWineAromaGroupParams) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

      const optimisticGroup: WineAromaGroup = {
        id: `temp-${Date.now()}`,
        nameUa: newColor.nameUa,
        nameEn: newColor.nameEn,
        colorHex: newColor.colorHex,
        sortNumber: newColor.sortNumber,
        subgroups: newColor.subgroups || [],
        colors: newColor.colors || [],
      }

      const currentRows = groupsQuery.data?.rows || []
      const currentCount = groupsQuery.data?.count || 0

      const newData = {
        rows: [...currentRows, optimisticGroup],
        count: currentCount + 1,
      }

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], newData)

      return { optimisticGroup, previousData: groupsQuery.data }
    },
    onSuccess: (newGroup: WineAromaGroup, _, context) => {
      // store.addAromaGroup(newGroup)
      // queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
      if (context?.optimisticGroup) {
        const groupWithDataArr = {
          ...newGroup,
          subgroups: newGroup.subgroups && newGroup.subgroups.length > 0 ? newGroup.subgroups : context.optimisticGroup.subgroups,
          colors: newGroup.colors && newGroup.colors.length > 0 ? newGroup.colors : context.optimisticGroup.colors,
        }
        const currentData = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters])

        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows.map((ag: WineAromaGroup) => (ag.id === context.optimisticGroup.id ? groupWithDataArr : ag)),
          count: old.count,
        }))

        if (currentData) {
          const updatedData = {
            rows: currentData.rows.map(ag => (ag.id === context.optimisticGroup.id ? groupWithDataArr : ag)),
            count: currentData.count,
          }

          queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], updatedData)
        }
      }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['aroma-groups', 'list', store.filters],
        refetchType: 'active',
      })
    },
  })

  const updateGroupMutation = useMutation({
    ...wineFlavorQueries.updateGroup(),
    onMutate: async (params: UpdateWineAromaGroupParams) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

      const previousGroups = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters])

      const optimisticGroup: WineAromaGroup = {
        id: params.groupId,
        nameUa: params.newGroup.nameUa,
        nameEn: params.newGroup.nameEn,
        colorHex: params.newGroup.colorHex,
        sortNumber: 0,
        subgroups: [],
        colors: [],
      }

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((ag: WineAromaGroup) => (ag.id === params.groupId ? { ...ag, ...optimisticGroup } : ag)),
        count: old.count,
      }))

      return { previousGroups, optimisticGroup, params }
    },
    onSuccess: (updatedGroup: WineAromaGroup, _, context) => {
      // store.updateAromaGroup(updatedGroup.id, updatedGroup)
      // queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
      if (!updatedGroup && context?.optimisticGroup) {
        return
      }

      if (updatedGroup) {
        const groupWithDataArr = {
          ...updatedGroup,
          subgroups: updatedGroup.subgroups && updatedGroup.subgroups.length > 0 ? updatedGroup.subgroups : context.optimisticGroup.subgroups,
          colors: updatedGroup.colors && updatedGroup.colors.length > 0 ? updatedGroup.colors : context.optimisticGroup.colors,
        }

        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
          rows: old.rows?.map((ag: WineAromaGroup) => (ag.id === updatedGroup.id ? groupWithDataArr : ag)) || [],
          count: old.count,
        }))
      }
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const deleteGroupMutation = useMutation({
    ...wineFlavorQueries.deleteGroup(),
    onMutate: async (colorId: string) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

      const previousGroups = queryClient.getQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters])
      const deletedGroup = previousGroups?.rows.find((ag: WineAromaGroup) => ag.id === colorId)

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.filter((cg: WineAromaGroup) => cg.id !== colorId),
        count: old.count - 1,
      }))

      return { previousGroups, deletedGroup }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const createSubgroupMutation = useMutation({
  ...wineFlavorQueries.createSubgroup(),
  onMutate: async ({ groupId, subgroupData }: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }) => {
    await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

    const previousGroups = getCurrentAromaGroups()

    const optimisticSubgroupData: WineAromaSubgroup = {
      id: `temp-shade-${Date.now()}`,
      nameUa: subgroupData.nameUa,
      nameEn: subgroupData.nameEn,
      sortNumber: subgroupData.sortNumber || 0,
      aromas: subgroupData.aromas || [],
    }

    queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
      rows: old.rows.map((ag: WineAromaGroup) => 
        ag.id === groupId 
          ? { 
              ...ag, 
              subgroups: [...(ag.subgroups || []), optimisticSubgroupData] 
            } 
          : ag
      ),
      count: old.count,
    }))

    return { previousGroups, optimisticSubgroupData, groupId, subgroupData }
  },
  onSuccess: (newSubgroup: WineAromaSubgroup, variables: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }, context) => {
    if (context?.optimisticSubgroupData) {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((ag: WineAromaGroup) =>
          ag.id === variables.groupId
            ? {
                ...ag,
                subgroups: ag.subgroups.map(sg => 
                  sg.id === context.optimisticSubgroupData.id ? newSubgroup : sg
                ),
              }
            : ag
        ),
        count: old.count,
      }))
    }
    queryClient.invalidateQueries({
      queryKey: ['aroma-groups', 'list'],
    })
  },
  onError: (_, __, context) => {
    if (context?.previousGroups) {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
    }
  },
})

  const updateSubgroupMutation = useMutation({
  ...wineFlavorQueries.updateSubgroup(),
  onMutate: async ({ groupId, subgroupId, newSubgroup }: { groupId: string; subgroupId: string; newSubgroup: CreateWineAromaSubgroupParams }) => {
    await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

    const previousGroups = getCurrentAromaGroups()

    const optimisticSubgroup: WineAromaSubgroup = {
      id: subgroupId,
      nameUa: newSubgroup.nameUa,
      nameEn: newSubgroup.nameEn,
      sortNumber: newSubgroup.sortNumber || 0,
      aromas: newSubgroup.aromas || [],
    }

    queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
      rows: old.rows.map((ag: WineAromaGroup) =>
        ag.id === groupId
          ? {
              ...ag,
              subgroups: ag.subgroups.map(sg => (sg.id === subgroupId ? optimisticSubgroup : sg)),
            }
          : ag
      ),
      count: old.count,
    }))

    return { previousGroups, optimisticSubgroup, groupId, subgroupId, newSubgroup }
  },
  onSuccess: (updatedSubgroup: WineAromaSubgroup, variables: { groupId: string; subgroupId: string; newSubgroup: CreateWineAromaSubgroupParams }, context) => {
    if (updatedSubgroup && context?.optimisticSubgroup) {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((ag: WineAromaGroup) =>
          ag.id === variables.groupId
            ? {
                ...ag,
                subgroups: ag.subgroups.map(sg => (sg.id === variables.subgroupId ? updatedSubgroup : sg)),
              }
            : ag
        ),
        count: old.count,
      }))
    }
    queryClient.invalidateQueries({
      queryKey: ['aroma-groups', 'list'],
    })
  },
  onError: (_, __, context) => {
    if (context?.previousGroups) {
      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
    }
  },
})
  // const createSubgroupMutation = useMutation({
  //   ...wineFlavorQueries.createSubgroup(),
  //   onMutate: async ({ groupId, subgroupData }: { groupId: string; subgroupData: CreateWineAromaSubgroupParams }) => {
  //     await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

  //     const previousGroups = getCurrentAromaGroups()

  //     const optimisticSubgroupData: WineAromaSubgroup = {
  //       id: `temp-shade-${Date.now()}`,
  //       nameUa: subgroupData.nameUa,
  //       nameEn: subgroupData.nameEn,
  //       sortNumber: subgroupData.sortNumber || 0,
  //       aromas: subgroupData.aromas || [],
  //     }

  //     queryClient.setQueryData<DataResponse<WineAromaSubgroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaSubgroup> = { rows: [], count: 0 }) => ({
  //       rows: old.rows.map((ag: WineAromaSubgroup) => (ag.id === groupId ? { ...ag, aromas: [...(ag.aromas || []), optimisticSubgroupData] } : ag)),
  //       count: old.count,
  //     }))

  //     return { previousGroups, optimisticSubgroupData, groupId }
  //   },
  //   onSuccess: (newSubgroup: WineAromaSubgroup, variables: CreateWineAromaSubgroupParams & { groupId: string }, context) => {
  //     // store.addSubgroup(variables.groupId, newSubgroup)
  //     // queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
  //     if (context?.optimisticSubgroupData) {
  //       queryClient.setQueryData<DataResponse<WineAromaSubgroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaSubgroup> = { rows: [], count: 0 }) => ({
  //         rows: old.rows.map((ag: WineAromaSubgroup) =>
  //           ag.id === variables.groupId
  //             ? {
  //                 ...ag,
  //                 aromas: ag.aromas.map(a => (a.id === context.optimisticSubgroupData.id ? newSubgroup : a)),
  //               }
  //             : ag
  //         ),
  //         count: old.count,
  //       }))
  //     }
  //     queryClient.invalidateQueries({
  //       queryKey: ['aroma-groups', 'list'],
  //     })
  //   },
  //   onError: (_, __, context) => {
  //     if (context?.previousGroups) {
  //       queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
  //     }
  //   },
  // })

  // const updateSubgroupMutation = useMutation({
  //   ...wineFlavorQueries.updateSubgroup(),
  //   onMutate: async ({ groupId, subgroupId, newSubgroup }: { groupId: string; subgroupId: string; newSubgroup: CreateWineAromaSubgroupParams }) => {
  //     await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

  //     const previousGroups = getCurrentAromaGroups()

  //     const optimisticSubgroup: WineAromaSubgroup = {
  //       id: subgroupId,
  //       nameUa: newSubgroup.nameUa,
  //       nameEn: newSubgroup.nameEn,
  //       sortNumber: newSubgroup.sortNumber || 0,
  //       aromas: newSubgroup.aromas || [],
  //     }

  //     queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
  //       rows: old.rows.map((ag: WineAromaGroup) =>
  //         ag.id === groupId
  //           ? {
  //               ...ag,
  //               subgroups: ag.subgroups.map(sg => (sg.id === subgroupId ? optimisticSubgroup : sg)),
  //             }
  //           : ag
  //       ),
  //       count: old.count,
  //     }))

  //     return { previousGroups, optimisticSubgroup, groupId, subgroupId }
  //   },
  //   onSuccess: (updatedSubgroup: WineAromaSubgroup, variables: UpdateWineAromaSubgroupParams & { groupId: string }, context) => {
  //     // store.updateSubgroup(variables.groupId, variables.subgroupId, updatedSubgroup)
  //     // queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
  //     if (updatedSubgroup && context?.optimisticSubgroup) {
  //       queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
  //         rows: old.rows.map((ag: WineAromaGroup) =>
  //           ag.id === variables.groupId
  //             ? {
  //                 ...ag,
  //                 subgroups: ag.subgroups.map(sg => (sg.id === variables.subgroupId ? updatedSubgroup : sg)),
  //               }
  //             : ag
  //         ),
  //         count: old.count,
  //       }))
  //     }
  //     queryClient.invalidateQueries({
  //       queryKey: ['aroma-groups', 'list'],
  //     })
  //   },
  //   onError: (_, __, context) => {
  //     if (context?.previousGroups) {
  //       queryClient.setQueryData<DataResponse<WineAromaGroup>>(['color-groups', 'list', store.filters], context.previousGroups)
  //     }
  //   },
  // })

  const deleteSubgroupMutation = useMutation({
    // mutationKey: ['aroma-subgroups', 'delete'],
    // mutationFn: (params: DeleteSubgroupParams) => wineFlavorQueries.deleteSubgroup().mutationFn(params.subgroupId),
    // onSuccess: (_, variables: DeleteSubgroupParams) => {
    //   store.deleteSubgroup(variables.groupId, variables.subgroupId)
    //   queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    // },
    ...wineFlavorQueries.deleteSubgroup(),
    onMutate: async (subgroupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['aroma-groups', 'list'] })

      const previousGroups = getCurrentAromaGroups()

      const groupWithSubgroup = previousGroups?.rows.find(ag => ag.subgroups.some(sg => sg.id === subgroupId))

      queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], (old: DataResponse<WineAromaGroup> = { rows: [], count: 0 }) => ({
        rows: old.rows.map((ag: WineAromaGroup) => (ag.id === groupWithSubgroup?.id ? { ...ag, subgroups: ag.subgroups.filter(sg => sg.id !== subgroupId) } : ag)),
        count: old.count,
      }))

      return { previousGroups, deletedSubgroupId: subgroupId, groupId: groupWithSubgroup?.id }
    },
    onError: (_, __, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData<DataResponse<WineAromaGroup>>(['aroma-groups', 'list', store.filters], context.previousGroups)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
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

const createSubgroup = (groupId: string, subgroupData: CreateWineAromaSubgroupParams) => {
  return createSubgroupMutation.mutateAsync({ groupId, subgroupData })
}

const updateSubgroup = (groupId: string, params: UpdateWineAromaSubgroupParams) => {
  return updateSubgroupMutation.mutateAsync({ 
    groupId, 
    subgroupId: params.subgroupId, 
    newSubgroup: params.newSubgroup 
  })
}

  const deleteSubgroup = (_: string, subgroupId: string) => {
    return deleteSubgroupMutation.mutateAsync(subgroupId)
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

  const getSubgroupById = (groupId: string, subgroupId: string) => {
    return store.getSubgroupById(groupId, subgroupId)
  }

  const getAromaById = (groupId: string, subgroupId: string, aromaId: string) => {
    return store.getAromaById(groupId, subgroupId, aromaId)
  }

  const hasAromaGroup = (id: string) => {
    return store.hasAromaGroup(id)
  }

  const onChangePagination = (offset: number) => {
    store.setFilters({ offset })
  }

  return {
    aromaGroups: groupsQuery.data,
    searchResults: store.searchResults,
    currentAromaGroup: store.currentAromaGroup,
    totalCount: groupsQuery?.data?.count || 0,
    filters: store.filters,

    isLoading: groupsQuery.isLoading,
    isError: groupsQuery.isError,
    error: groupsQuery.error,

    isCreatingGroup: createGroupMutation.isPending,
    isUpdatingGroup: updateGroupMutation.isPending,
    isDeletingGroup: deleteGroupMutation.isPending,
    isCreatingSubgroup: createSubgroupMutation.isPending,
    isUpdatingSubgroup: updateSubgroupMutation.isPending,
    isDeletingSubgroup: deleteSubgroupMutation.isPending,

    createGroup,
    updateGroup,
    deleteGroup,
    createSubgroup,
    updateSubgroup,
    deleteSubgroup,
    searchAromaGroups,
    clearSearch,
    setCurrentAromaGroup,
    getAromaGroupById,
    getSubgroupById,
    getAromaById,
    hasAromaGroup,

    refetchGroups: groupsQuery.refetch,
    refetchGroupsWithParams: customRefetchGroups,
    groupsQuery,
    onChangePagination,
  }
}
