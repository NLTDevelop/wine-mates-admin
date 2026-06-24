import { useCallback } from 'react'

interface UseGroupUIProps {
  deletedGroups: number[]
  deletedSubgroups: string[]
  setDeletedGroups: (updater: (prev: number[]) => number[]) => void
  setDeletedSubgroups: (updater: (prev: string[]) => string[]) => void
  onDeleteGroup: (groupId: number) => void
  onRestoreGroup: (groupId: number) => void
  onDeleteSubgroup: (groupId: number, subgroupId: number) => void
  onRestoreSubgroup: (groupId: number, subgroupId: number) => void
  toggleGroupInSubgroup: (groupId: number, subgroupId: number, aromaIds: number[]) => void
  getSubgroupOptions: (groupId: number, subgroupId: number) => any[]
}

export const useGroupUI = ({
  deletedGroups,
  deletedSubgroups,
  setDeletedGroups,
  setDeletedSubgroups,
  onDeleteGroup,
  onRestoreGroup,
  onDeleteSubgroup,
  onRestoreSubgroup,
  toggleGroupInSubgroup,
  getSubgroupOptions,
}: UseGroupUIProps) => {
  const handleGroupDeleteOrRestore = useCallback(
    (groupId: number) => {
      if (deletedGroups.includes(groupId)) {
        onRestoreGroup(groupId)
        setDeletedGroups(prev => prev.filter(id => id !== groupId))
        setDeletedSubgroups(prev => prev.filter(key => !key.startsWith(`${groupId}-`)))
      } else {
        onDeleteGroup(groupId)
        setDeletedGroups(prev => [...prev, groupId])
      }
    },
    [deletedGroups, onDeleteGroup, onRestoreGroup, setDeletedGroups, setDeletedSubgroups]
  )

  const handleSubgroupDeleteOrRestore = useCallback(
    (groupId: number, subgroupId: number) => {
      const subgroupKey = `${groupId}-${subgroupId}`

      if (deletedSubgroups.includes(subgroupKey)) {
        onRestoreSubgroup(groupId, subgroupId)
        setDeletedSubgroups(prev => prev.filter(key => key !== subgroupKey))
      } else {
        onDeleteSubgroup(groupId, subgroupId)
        setDeletedSubgroups(prev => [...prev, subgroupKey])
      }
    },
    [deletedSubgroups, onDeleteSubgroup, onRestoreSubgroup, setDeletedSubgroups]
  )

  const handleItemSelect = (groupId: number, subgroupId: number, selectedValues: string | string[]) => {
    const valuesArray = Array.isArray(selectedValues) ? selectedValues : [selectedValues]
    const aromaIds = valuesArray.map(v => parseInt(v))
    toggleGroupInSubgroup(groupId, subgroupId, aromaIds)
  }

  const createSubgroupFetchOptions = (groupId: number, subgroupId: number) => {
    return async (search?: string) => {
      const options = getSubgroupOptions(groupId, subgroupId)

      if (search) {
        return options.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
      }

      return options
    }
  }
  const getSubgroupSelectedValues = (subgroup: { selectedItems: number[] }): string[] => {
    return subgroup?.selectedItems?.map(id => String(id))
  }

  return {
    handleGroupDeleteOrRestore,
    handleSubgroupDeleteOrRestore,
    handleItemSelect,
    createSubgroupFetchOptions,
    getSubgroupSelectedValues,
  }
}
