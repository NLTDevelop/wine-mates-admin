import { useMemo, useState } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { CreateWineAromaGroupParams, StateItem, WineAromaGroup } from '../entities/types/flavor'
import { lightenColor, sortColorsByBrightness } from '@/lib/utils'
import { mockAromaGroups } from '../entities/mock'

export const useFlavorPalette = () => {
  const aromaGroups = mockAromaGroups
  const { isLoading, createGroup, deleteGroup, createItem, updateItem } = useWineFlavor()

  const [isAccordionOpen, setIsAccordionOpen] = useState<{ [groupId: string]: boolean }>({})
  const [editingGroups, setEditingGroups] = useState<{
    [groupId: string]: { group?: WineAromaGroup; editingItem?: any }
  }>({})
  const [isFormOpen, setIsFormOpen] = useState<{ [groupId: string]: boolean }>({})
  const [newItemData, setNewItemData] = useState<{
    [groupId: string]: {
      name: string
      nameEn: string
      description?: string
    }
  }>({})

  const [itemStates, setItemStates] = useState<{    [itemId: string]: StateItem[]  }>({})
  

  const handleAddGroup = (groupData: Partial<CreateWineAromaGroupParams>) => {
    createGroup(groupData)
  }

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId)
  }

  const handleAddItem = (groupId: string) => {
    const itemData = newItemData[groupId]
    if (itemData) {
      const group = aromaGroups.find(g => g.id === groupId)
      if (group) {
        const lightenedColor = lightenColor(group.value, 20)

        createItem(groupId, {
          ...itemData,
          value: lightenedColor,
          state: itemStates[`new-${groupId}`] || [],
        })

        setNewItemData(prev => ({
          ...prev,
          [groupId]: { name: '', nameEn: '', description: '' },
        }))
        setItemStates(prev => {
          const newState = { ...prev }
          delete newState[`new-${groupId}`]
          return newState
        })
      }
    }
  }

  const handleToggleForm = (groupId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))

    if (!isFormOpen[groupId]) {
      setEditingGroups(prev => ({
        ...prev,
        [groupId]: {},
      }))
    }
  }

  const handleEditGroup = (groupId: string, group: WineAromaGroup) => {
    setEditingGroups(prev => ({
      ...prev,
      [groupId]: { group },
    }))
    setIsFormOpen(prev => ({ ...prev, [groupId]: true }))

    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        name: group.label,
        nameEn: group.labelEn || '',
      },
    }))
  }

  const handleEditItem = (groupId: string, itemData: any) => {
    let itemToEdit = itemData
    if (itemData.items && itemData.items.length > 0) {
      itemToEdit = itemData.items[0]
    }

    setItemStates(prev => {
      const newState = { ...prev }
      delete newState[`new-${groupId}`]
      return newState
    })

    setEditingGroups(prev => ({
      ...prev,
      [groupId]: { editingItem: itemToEdit },
    }))

    setIsFormOpen(prev => ({ ...prev, [groupId]: true }))

    setNewItemData(prev => ({
      ...prev,
      [groupId]: {
        name: itemToEdit.name || itemToEdit.label || '',
        nameEn: itemToEdit.nameEn || itemToEdit.labelEn || '',
      },
    }))

    setItemStates(prev => ({
      ...prev,
      [itemToEdit.id]: itemToEdit.state || [],
    }))
  }

  const handleCancelEdit = (groupId: string) => {
    setEditingGroups(prev => {
      const newState = { ...prev }
      delete newState[groupId]
      return newState
    })

    setNewItemData(prev => ({
      ...prev,
      [groupId]: { name: '', nameEn: '', description: '' },
    }))
    setIsFormOpen(prev => ({ ...prev, [groupId]: false }))

    setItemStates(prev => {
      const newState = { ...prev }
      const editingItem = editingGroups[groupId]?.editingItem
      if (editingItem?.id) {
        delete newState[editingItem.id]
      }
      delete newState[`new-${groupId}`]
      return newState
    })
  }

  const handleSaveItem = (groupId: string) => {
    const editingGroup = editingGroups[groupId]

    if (editingGroup?.editingItem) {
      const group = aromaGroups.find(g => g.id === groupId)
      const lightenedColor = group ? lightenColor(group.value, 20) : editingGroup.editingItem.value

      updateItem(groupId, editingGroup.editingItem.id, {
        name: newItemData[groupId].name,
        nameEn: newItemData[groupId].nameEn,
        value: lightenedColor,
        state: itemStates[editingGroup.editingItem.id] || [],
      })
    } else {
      handleAddItem(groupId)
    }
    handleCancelEdit(groupId)
  }

  const handleUpdateItemStates = (itemId: string, states: StateItem[]) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: states,
    }))
  }

  const getItemStates = (itemId: string): StateItem[] => {
    return itemStates[itemId] || []
  }

  const getNewItemStates = (groupId: string): StateItem[] => {
    return itemStates[`new-${groupId}`] || []
  }

  const getEditingGroup = (groupId: string) => {
    return editingGroups[groupId] || null
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

  const sortedItems = useMemo(() => {
    return sortColorsByBrightness(aromaGroups)
  }, [aromaGroups])

  const canAddItem = (groupId: string) => {
    const data = newItemData[groupId]
    return !!(data?.name && data.nameEn)
  }

  return {
    aromaGroups: sortedItems,
    isLoading,
    editingGroups,
    getEditingGroup,
    isFormOpen,
    newItemData,
    isAccordionOpen,
    itemStates,

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

    handleUpdateItemStates,
    getItemStates,
    getNewItemStates,
  }
}
