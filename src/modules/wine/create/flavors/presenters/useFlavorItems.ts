import { useCallback } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { CreateWineAromaItemParams, WineAromaSubgroup } from '../entities/types/flavor-types'
import { EditingGroupState, NewItemData } from '../entities/types/flavor-palette-types'

interface UseFlavorItemsProps {
  aromaGroups: any[]
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useFlavorItems = ({ aromaGroups, editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions }: UseFlavorItemsProps) => {
  const { createAroma, updateSubgroup, deleteSubgroup, isCreatingAroma, isUpdatingAroma } = useWineFlavor()

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
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    },
    [deleteSubgroup]
  )

  const handleSaveItem = useCallback(
    async (groupId: string, subgroupId: string) => {
      const group = aromaGroups.find(g => g.id === groupId)
      if (!group || !group.subgroups?.[0]) return

      const targetSubgroupId = group.subgroups[0].id

      if (editingGroup?.editingItem) {
        const subgroupData = {
          nameUa: newItemData[groupId]?.name || editingGroup.editingItem.nameUa,
          nameEn: newItemData[groupId]?.nameEn || editingGroup.editingItem.nameEn,
          aromas: newItemData[groupId]?.aromas || [],
          sortNumber: editingGroup.editingItem.sortNumber,
        }

        try {
          await updateSubgroup(groupId, { subgroupId, newSubgroup: subgroupData })
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to update item:', error)
        }
      } else if (newItemData[groupId]) {
        const itemData: CreateWineAromaItemParams = {
          nameUa: newItemData[groupId].name,
          nameEn: newItemData[groupId].nameEn,
          aromas: newItemData[groupId].aromas || [],
        }

        try {
          await createAroma(groupId, targetSubgroupId, itemData)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to create item:', error)
        }
      }
    },
    [aromaGroups, editingGroup, newItemData, updateSubgroup, createAroma, setEditingGroup, setNewItemData]
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
      return data?.name && data?.nameEn
    },
    [newItemData]
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
    isCreatingAroma,
    isUpdatingAroma,
  }
}
