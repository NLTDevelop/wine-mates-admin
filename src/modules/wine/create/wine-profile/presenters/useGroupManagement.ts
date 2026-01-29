import { useState, useCallback, useEffect } from 'react'
import { Group, IItem, Subgroup } from '../enteties/types/items-types'

interface UseGroupManagementProps<TGroup> {
  initialGroups: TGroup[]
}

export function useGroupManagement<TItem extends IItem, TSubgroup extends Subgroup<TItem>, TGroup extends Group<TSubgroup>>({ initialGroups }: UseGroupManagementProps<TGroup>) {
  const [groups, setGroups] = useState<TGroup[]>(() => {
    const result = initialGroups.map(group => {
      const processedGroup = {
        ...group,
        subgroups: group.subgroups.map(subgroup => {
          return {
            ...subgroup,
            selectedItems: subgroup.items.map(item => item.id),
          }
        }),
      }

      return processedGroup
    })

    return result
  })

  useEffect(() => {
    const shouldUpdate =
      initialGroups.length > 0 &&
      (groups.length === 0 || groups.length !== initialGroups.length || groups[0]?.id !== initialGroups[0]?.id || JSON.stringify(groups[0]?.subgroups) !== JSON.stringify(initialGroups[0]?.subgroups))

    if (shouldUpdate) {
      const newGroups = initialGroups.map(group => {
        return {
          ...group,
          subgroups: (group.subgroups || []).map(subgroup => {
            const items =
              subgroup.items && subgroup.items.length > 0
                ? subgroup.items
                : [
                    {
                      id: subgroup.id || group.id,
                      name: subgroup.name || group.name,
                      colorHex: subgroup.colorHex || group.colorHex,
                    },
                  ]

            return {
              ...subgroup,
              items,
              selectedItems: subgroup.selectedItems || [],
            }
          }),
        }
      })

      setGroups(newGroups)
    }
  }, [initialGroups])

  const [deletedGroups, setDeletedGroups] = useState<number[]>([])
  const [deletedSubgroups, setDeletedSubgroups] = useState<string[]>([])

  const deleteGroup = useCallback((groupId: number) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              subgroups: group.subgroups.map(sub => ({ ...sub, selectedItems: [] })),
            }
          : group
      )
    )
    setDeletedGroups(prev => [...prev, groupId])
  }, [])

  const restoreGroup = useCallback(
    (groupId: number) => {
      const originalGroup = initialGroups.find(g => g.id === groupId)
      if (!originalGroup) return
      setGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? {
                ...originalGroup,
                subgroups: originalGroup.subgroups.map(sub => ({
                  ...sub,
                  selectedItems: sub.items.map(i => i.id),
                })),
              }
            : group
        )
      )
      setDeletedGroups(prev => prev.filter(id => id !== groupId))
    },
    [initialGroups]
  )

  const deleteSubgroup = useCallback((groupId: number, subgroupId: number) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              subgroups: group.subgroups.map(sub => (sub.id === subgroupId ? { ...sub, selectedItems: [] } : sub)),
            }
          : group
      )
    )
    setDeletedSubgroups(prev => [...prev, `${groupId}-${subgroupId}`])
  }, [])

  const restoreSubgroup = useCallback(
    (groupId: number, subgroupId: number) => {
      const originalGroup = initialGroups.find(g => g.id === groupId)
      const originalSubgroup = originalGroup?.subgroups.find(s => s.id === subgroupId)
      if (!originalGroup || !originalSubgroup) return

      setGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? {
                ...group,
                subgroups: group.subgroups.map(sub => (sub.id === subgroupId ? { ...originalSubgroup, selectedItems: originalSubgroup.items.map(i => i.id) } : sub)),
              }
            : group
        )
      )
      setDeletedSubgroups(prev => prev.filter(key => key !== `${groupId}-${subgroupId}`))
    },
    [initialGroups]
  )

  const toggleItemsInSubgroup = useCallback((groupId: number, subgroupId: number, itemIds: number[]) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              subgroups: group.subgroups.map(sub => (sub.id === subgroupId ? { ...sub, selectedItems: itemIds } : sub)),
            }
          : group
      )
    )
  }, [])

  const getSubgroupOptions = useCallback(
    (groupId: number, subgroupId: number) => {
      const group = groups.find(g => g.id === groupId)
      const subgroup = group?.subgroups.find(s => s.id === subgroupId)
      if (!subgroup) return []

      return subgroup?.items?.map(item => ({
        value: item?.id?.toString(),
        label: item?.name,
        style: { badgeColor: item?.colorHex, iconColor: item?.colorHex },
      }))
    },
    [groups]
  )

  const getResultData = useCallback(() => {
    return groups
      .filter(g => !deletedGroups.includes(g.id))
      .map(g => ({
        ...g,
        subgroups: g.subgroups
          .filter(s => !deletedSubgroups.includes(`${g.id}-${s.id}`))
          .map(s => ({
            ...s,
            items: s?.items?.filter(i => s.selectedItems.includes(i.id)) ?? [],
          })),
      }))
  }, [groups, deletedGroups, deletedSubgroups])

  const getResultDataFl = useCallback(() => {
    return groups
      .filter(g => !deletedGroups.includes(g.id))
      .map(g => ({
        ...g,
        subgroups: g.subgroups,
      }))
  }, [groups, deletedGroups, deletedSubgroups])

  const isGroupDeleted = useCallback((groupId: number) => deletedGroups.includes(groupId), [deletedGroups])
  const isSubgroupDeleted = useCallback((groupId: number, subgroupId: number) => deletedSubgroups.includes(`${groupId}-${subgroupId}`), [deletedSubgroups])

  const initializeFromData = useCallback((mappedData: TGroup[]) => {
    setGroups(mappedData)
  }, [])

  const reset = useCallback(() => {
    setGroups(initialGroups || [])
    setDeletedGroups([])
    setDeletedSubgroups([])
  }, [initialGroups])

  return {
    groups,
    deletedGroups,
    deletedSubgroups,
    setDeletedGroups,
    setDeletedSubgroups,
    deleteGroup,
    restoreGroup,
    deleteSubgroup,
    restoreSubgroup,
    toggleItemsInSubgroup,
    getSubgroupOptions,
    getResultData,
    isGroupDeleted,
    isSubgroupDeleted,
    initializeFromData,
    reset,
    getResultDataFl,
  }
}
