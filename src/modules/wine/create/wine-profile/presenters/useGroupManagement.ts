import { useState, useCallback } from 'react'
import { Group, IItem } from '../enteties/items-types'

interface UseGroupManagementProps {
  initialGroups: Group[]
  itemName: string
}

export const useGroupManagement = ({ initialGroups, itemName }: UseGroupManagementProps) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    return initialGroups.map(group => ({
      ...group,
      subgroups:
        group?.subgroups?.map(subgroup => ({
          ...subgroup,
          selectedItems: subgroup?.[itemName]?.map((item: IItem) => item.id) || [],
        })) || [],
    }))
  })

  const [deletedGroups, setDeletedGroups] = useState<number[]>([])
  const [deletedSubgroups, setDeletedSubgroups] = useState<string[]>([])

  const deleteGroup = useCallback((groupId: number) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            subgroups: group?.subgroups?.map(subgroup => ({
              ...subgroup,
              selectedItems: [],
            })),
          }
        }
        return group
      })
    )

    setDeletedGroups(prev => [...prev, groupId])
  }, [])

  const restoreGroup = useCallback(
    (groupId: number) => {
      setGroups(prev =>
        prev.map(group => {
          if (group.id === groupId) {
            const originalGroup = initialGroups.find(g => g.id === groupId)
            if (originalGroup) {
              return {
                ...originalGroup,
                subgroups: originalGroup?.subgroups?.map(subgroup => ({
                  ...subgroup,
                  selectedItems: subgroup?.[itemName]?.map((item: IItem) => item.id),
                })),
              }
            }
          }
          return group
        })
      )

      setDeletedGroups(prev => prev.filter(id => id !== groupId))
    },
    [initialGroups]
  )

  const deleteSubgroup = useCallback((groupId: number, subgroupId: number) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            subgroups: group?.subgroups?.map(subgroup => {
              if (subgroup.id === subgroupId) {
                return { ...subgroup, selectedItems: [] }
              }
              return subgroup
            }),
          }
        }
        return group
      })
    )

    setDeletedSubgroups(prev => [...prev, `${groupId}-${subgroupId}`])
  }, [])

  const restoreSubgroup = useCallback(
    (groupId: number, subgroupId: number) => {
      const originalGroup = initialGroups.find(g => g.id === groupId)
      if (!originalGroup) return

      const originalSubgroup = originalGroup?.subgroups?.find(s => s.id === subgroupId)
      if (!originalSubgroup) return

      setGroups(prev =>
        prev.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              subgroups: group?.subgroups?.map(subgroup => {
                if (subgroup.id === subgroupId) {
                  return {
                    ...originalSubgroup,
                    selectedItems: originalSubgroup[itemName].map((item: IItem) => item.id),
                  }
                }
                return subgroup
              }),
            }
          }
          return group
        })
      )

      setDeletedSubgroups(prev => prev.filter(key => key !== `${groupId}-${subgroupId}`))
    },
    [initialGroups]
  )

  const toggleItemsInSubgroup = useCallback((groupId: number, subgroupId: number, itemIds: number[]) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          const newSubgroups = group?.subgroups?.map(subgroup => {
            if (subgroup.id === subgroupId) {
              return { ...subgroup, selectedItems: itemIds }
            }
            return subgroup
          })

          return { ...group, subgroups: newSubgroups }
        }
        return group
      })
    )
  }, [])

  const getSubgroupOptions = useCallback(
    (groupId: number, subgroupId: number) => {
      const group = groups.find(g => g.id === groupId)
      if (!group) return []

      const subgroup = group?.subgroups?.find(s => s.id === subgroupId)
      if (!subgroup || !itemName) return []

      const items = subgroup[itemName as keyof typeof subgroup]
      if (!Array.isArray(items) || items.length === 0) {
        return []
      }

      return items.map((item: IItem) => ({
        value: item.id.toString(),
        label: item.name,
        style: {
          badgeColor: item.colorHex,
          iconColor: item.colorHex,
        },
      }))
    },
    [groups, itemName]
  )

  const getSelectedGroupData = useCallback(() => {
    const groupIds: string[] = []
    const subgroupIds: string[] = []
    const itemIds: string[] = []

    groups.forEach(group => {
      if (deletedGroups.includes(group.id)) return

      const groupHasSelectedGroup = group?.subgroups?.some(subgroup => {
        if (!subgroup?.selectedItems) return
        subgroup.selectedItems.length > 0 && !deletedSubgroups.includes(`${group.id}-${subgroup.id}`)
      })

      if (groupHasSelectedGroup) {
        groupIds.push(group.id.toString())
      }

      group?.subgroups?.forEach(subgroup => {
        if (deletedSubgroups.includes(`${group.id}-${subgroup.id}`)) return

        if (!subgroup?.selectedItems) return

        if (subgroup?.selectedItems.length > 0) {
          subgroupIds.push(subgroup.id.toString())
          itemIds.push(...subgroup.selectedItems.map(id => id.toString()))
        }
      })
    })

    return {
      groupIds,
      subgroupIds,
      itemIds: [...new Set(itemIds)],
    }
  }, [groups, deletedGroups, deletedSubgroups])

  const getResultData = useCallback(() => {
    return groups.reduce((result, group) => {
      if (deletedGroups.includes(group.id)) {
        return result
      }

      const groupResult = {
        groupId: group.id,
        name: group.name,
        colorHex: group.colorHex,
        subgroups: [] as any[],
      }

      if (group?.subgroups?.length === 0) {
        result.push(groupResult)
        return result
      }

      const nonDeletedSubgroups = group?.subgroups?.filter(subgroup => !deletedSubgroups.includes(`${group.id}-${subgroup.id}`))

      if (nonDeletedSubgroups && nonDeletedSubgroups?.length > 0) {
        nonDeletedSubgroups?.forEach(subgroup => {
          const subgroupResult = {
            subgroupId: subgroup.id,
            subgroupName: subgroup.name,
            subgroupColorHex: subgroup.colorHex,
            items: [] as any[],
          }

          if (subgroup.selectedItems && subgroup.selectedItems.length > 0) {
            const itemsArray = subgroup[itemName as keyof typeof subgroup]

            if (Array.isArray(itemsArray)) {
              subgroupResult.items = subgroup.selectedItems
                .map(itemId => {
                  const item = itemsArray.find((item: any) => item.id === itemId)
                  return item
                    ? {
                        name: item.name,
                        colorHex: item.colorHex || subgroup.colorHex,
                      }
                    : null
                })
                .filter(Boolean)
            }
          }

          groupResult.subgroups.push(subgroupResult)
        })

        result.push(groupResult)
      } else {
        result.push(groupResult)
      }

      return result
    }, [] as any[])
  }, [groups, deletedGroups, deletedSubgroups, itemName])

  const isGroupDeleted = useCallback((groupId: number) => deletedGroups.includes(groupId), [deletedGroups])
  const isSubgroupDeleted = useCallback((groupId: number, subgroupId: number) => deletedSubgroups.includes(`${groupId}-${subgroupId}`), [deletedSubgroups])

  return {
    groups,
    deletedGroups,
    deletedSubgroups,
    setDeletedGroups,
    setDeletedSubgroups,
    deleteGroup,
    deleteSubgroup,
    restoreGroup,
    restoreSubgroup,
    toggleItemsInSubgroup,
    getSubgroupOptions,
    getSelectedGroupData,
    getResultData: getResultData,
    isGroupDeleted,
    isSubgroupDeleted,
  }
}
