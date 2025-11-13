import { useCallback } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { WineAromaGroup, WineAromaItem, WineAromaSubgroup } from '../entities/types/flavor-types'
import { EditingGroupState, NewItemData } from '../entities/types/flavor-palette-types'

interface UseFlavorItemsProps {
  aromaGroups: WineAromaGroup[] | undefined
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useFlavorItems = ({ editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions }: UseFlavorItemsProps) => {
  const { createSubgroup, updateSubgroup, deleteSubgroup, refetchGroupsWithParams } = useWineFlavor()

  const handleAddAromaClick = useCallback(
    (groupId: string) => {
      if (newItemData[groupId]) {
        setNewItemData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
      } else {
        setNewItemData((prev: Record<string, NewItemData>) => ({
          ...prev,
          [groupId]: { name: '', nameEn: '', aromas: [] },
        }))
        if (editingGroup?.groupId === groupId && editingGroup.isEditingGroup) {
          setEditingGroup(null)
        }
      }
    },
    [editingGroup, newItemData, setEditingGroup, setNewItemData]
  )

  const handleEditItem = useCallback(
    (groupId: string, item?: WineAromaSubgroup) => {
      if (!item) return

      setEditingGroup({
        groupId,
        editingItem: item,
        isEditingGroup: false,
      })

      setNewItemData((prev: Set<string>) => ({
        ...prev,
        [groupId]: {
          name: item.nameUa || '',
          nameEn: item.nameEn || '',
          aromas: item.aromas || [],
        },
      }))

      if (!openAccordions.has(groupId)) {
        setOpenAccordions((prev: Set<string>) => new Set(prev).add(groupId))
      }
    },
    [openAccordions, setEditingGroup, setNewItemData, setOpenAccordions]
  )

  const onRemoveItem = useCallback(
    async (groupId: string, subgroupId: string) => {
      try {
        await deleteSubgroup(groupId, subgroupId)
        await refetchGroupsWithParams(['subgroups'])
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    },
    [deleteSubgroup, refetchGroupsWithParams]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const editingItem = editingGroup?.editingItem
      const currentData = newItemData[groupId]

      if (!editingItem) {
        return currentData?.name && currentData?.nameEn
      }

      if (!currentData) return false

      return editingItem.nameUa !== currentData.name || editingItem.nameEn !== currentData.nameEn || JSON.stringify(editingItem.aromas) !== JSON.stringify(currentData.aromas)
    },
    [editingGroup, newItemData]
  )

  const handleSaveItem = useCallback(
    async (groupId: string) => {
      const isNewItem = !editingGroup?.editingItem

      if (!isNewItem && !hasChanges(groupId)) {
        setEditingGroup(null)
        setNewItemData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
        return
      }

      if (editingGroup?.editingItem && editingGroup.groupId === groupId) {
        const subgroupData = {
          nameUa: newItemData[groupId]?.name || editingGroup.editingItem.nameUa,
          nameEn: newItemData[groupId]?.nameEn || editingGroup.editingItem.nameEn,
          aromas: newItemData[groupId]?.aromas || editingGroup.editingItem.aromas || [],
          sortNumber: editingGroup.editingItem.sortNumber,
        }

        try {
          await updateSubgroup(groupId, {
            subgroupId: editingGroup.editingItem.id,
            newSubgroup: subgroupData,
          })
          await refetchGroupsWithParams(['subgroups'])
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to update subgroup:', error)
        }
      } else if (newItemData[groupId]) {
        const subgroupData = {
          nameUa: newItemData[groupId].name,
          nameEn: newItemData[groupId].nameEn,
          aromas: newItemData[groupId].aromas || [],
        }

        try {
          await createSubgroup(groupId, subgroupData)
          await refetchGroupsWithParams(['subgroups'])
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to create subgroup:', error)
        }
      }
    },
    [editingGroup, newItemData, updateSubgroup, createSubgroup, setEditingGroup, setNewItemData, refetchGroupsWithParams, hasChanges]
  )

  const handleCancelItemEdit = useCallback(
    (groupId: string) => {
      setEditingGroup((prev: EditingGroupState | null) => (prev?.groupId === groupId ? null : prev))
      setNewItemData((prev: Record<string, NewItemData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })
    },
    [setEditingGroup, setNewItemData]
  )

  const updateItemFormData = useCallback(
    (groupId: string, field: 'name' | 'nameEn', value: string) => {
      setNewItemData((prev: Record<string, NewItemData>) => {
        const newData = {
          ...prev,
          [groupId]: {
            ...prev[groupId],
            [field]: value,
          },
        }
        return newData
      })
    },
    [setNewItemData]
  )

  const canAddItem = useCallback(
    (groupId: string) => {
      const data = newItemData[groupId]
      if (!data) return false

      const subgroupNameUa = data.nameUa || data.name
      const subgroupNameEn = data.nameEn

      if (!subgroupNameUa?.trim() || !subgroupNameEn?.trim()) {
        return false
      }

      if (data.aromas && data.aromas.length > 0) {
        const hasInvalidAromas = data.aromas.some((aroma: WineAromaItem) => !aroma.nameUa?.trim() || !aroma.nameEn?.trim())
        if (hasInvalidAromas) {
          return false
        }
      }

      const isEditingItem = editingGroup?.groupId === groupId && editingGroup?.editingItem
      if (isEditingItem) {
        return hasChanges(groupId)
      }

      return true
    },
    [newItemData, editingGroup, hasChanges]
  )

  const getItemName = useCallback((item: any) => {
    return item.nameUa || item.name || ''
  }, [])

  return {
    handleAddAromaClick,
    handleEditItem,
    onRemoveItem,
    handleSaveItem,
    handleCancelItemEdit,
    updateItemFormData,
    canAddItem,
    getItemName,
  }
}
