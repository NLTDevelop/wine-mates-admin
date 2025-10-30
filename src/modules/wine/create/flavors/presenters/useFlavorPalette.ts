import { useState } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { WineAromaGroup } from '../entities/types/flavor'

export const useFlavorPalette = () => {
  const { isLoading, createGroup, deleteGroup, createItem, updateItem } = useWineFlavor()

  const [isAccordionOpen, setIsAccordionOpen] = useState<{ [groupId: string]: boolean }>({})
  const [editingGroup, setEditingGroup] = useState<{ groupId: string; group?: WineAromaGroup; editingItem?: any } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<{ [groupId: string]: boolean }>({})
  const [newItemData, setNewItemData] = useState<{
    [groupId: string]: {
      name: string
      nameEn: string
      description?: string
    }
  }>({})

  const handleAddGroup = (groupData: { value: string; label: string; labelEn: string }) => {
    createGroup(groupData)
  }

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId)
  }

  const handleAddItem = (groupId: string) => {
    const itemData = newItemData[groupId]
    if (itemData) {
      createItem(groupId, itemData)
      setNewItemData(prev => ({
        ...prev,
        [groupId]: { name: '', nameEn: '', description: '' },
      }))
    }
  }

  const handleToggleForm = (groupId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const handleEditGroup = (groupId: string, group: WineAromaGroup) => {
    setEditingGroup({ groupId, group })
    setIsFormOpen(prev => ({ ...prev, [groupId]: true }))

    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        name: group.label,
        nameEn: group.labelEn || '',
      },
    }))
  }

  const handleEditItem = (groupId: string, item: any) => {
    setEditingGroup({
      groupId,
      editingItem: item,
    })
    setIsFormOpen(prev => ({ ...prev, [groupId]: true }))

    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        name: item.name || item.label || '',
        nameEn: item.nameEn || item.labelEn || '',
      },
    }))
  }

  const handleCancelEdit = (groupId: string) => {
    setEditingGroup(null)
    setNewItemData(prev => ({
      ...prev,
      [groupId]: { name: '', nameEn: '', description: '' },
    }))
    setIsFormOpen(prev => ({ ...prev, [groupId]: false }))
  }

  const handleSaveItem = (groupId: string) => {
    if (editingGroup && editingGroup.groupId === groupId) {
      if (editingGroup.editingItem) {
        updateItem(groupId, editingGroup.editingItem.id, {
          name: newItemData[groupId].name,
          nameEn: newItemData[groupId].nameEn,
          description: newItemData[groupId].description,
        })
      }
    } else {
      handleAddItem(groupId)
    }
    handleCancelEdit(groupId)
  }

  const updateItemFormData = (groupId: string, field: string, value: string) => {
    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [field]: value,
      },
    }))
  }

  const handleToggleAccordion = (groupId: string, isOpen: boolean) => {
    setIsAccordionOpen(prev => ({
      ...prev,
      [groupId]: isOpen,
    }))
    if (!isOpen && isFormOpen[groupId]) {
      handleCancelEdit(groupId)
    }
  }

  const canAddItem = (groupId: string) => {
    const data = newItemData[groupId]
    return !!(data?.name && data.nameEn)
  }

  return {
    isLoading,
    editingGroup,
    isFormOpen,
    newItemData,
    isAccordionOpen,

    handleAddGroup,
    handleDeleteGroup,
    handleToggleForm,
    handleEditGroup,
    handleEditItem,
    handleCancelEdit,
    handleSaveItem,
    updateItemFormData,
    canAddItem,
    handleToggleAccordion,
  }
}
