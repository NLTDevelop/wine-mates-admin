import { useCallback } from 'react'
import { NameDictionary } from '../../general/entities/types'
import { arraysEqual, createTranslations, getDisplayNames } from '@/lib/utils'
import { WineTasteGroup, WineTasteItem } from '../entities/types/tastes'
import { useWineTaste } from './useWineTaste'
import { useWineTasteStore } from '../entities/wine-taste-store'
import { EditingGroupState, NewItemData } from '../entities/taste-palette-types'

interface UseTasteItemsProps {
  tasteGroups: WineTasteGroup[] | undefined
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useTasteItems = ({ tasteGroups, editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions }: UseTasteItemsProps) => {
  const { createTaste, updateTaste, deleteTaste, reorderTaste } = useWineTaste()

  const store = useWineTasteStore()

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
          [groupId]: { translations: createTranslations('', ''), colorHex: '' },
        }))
        if (editingGroup?.groupId === groupId && editingGroup.isEditingGroup) {
          setEditingGroup(null)
        }
      }
    },
    [editingGroup, newItemData, setEditingGroup, setNewItemData]
  )

  const handleEditItem = useCallback(
    (groupId: string, item?: WineTasteItem) => {
      if (!item) return

      setEditingGroup({
        groupId,
        editingItem: item,
        isEditingGroup: false,
      })

      setNewItemData((prev: Set<string>) => ({
        ...prev,
        [groupId]: {
          translations: item.translations || [],
          colorHex: item.colorHex || '',
        },
      }))

      if (!openAccordions.has(groupId)) {
        setOpenAccordions((prev: Set<string>) => new Set(prev).add(groupId))
      }
    },
    [openAccordions, setEditingGroup, setNewItemData, setOpenAccordions]
  )

  const onRemoveItem = useCallback(
    async (groupId: string, tasteId: string) => {
      try {
        const isEditingCurrentItem = editingGroup?.groupId === groupId && editingGroup?.editingItem?.id === tasteId

        await deleteTaste({ groupId, tasteId })

        if (isEditingCurrentItem) {
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        }
      } catch (error) {
        console.error('Failed to delete shade:', error)
      }
    },
    [deleteTaste, editingGroup, setEditingGroup, setNewItemData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const editingItem = editingGroup?.editingItem
      const currentData = newItemData[groupId]

      if (!editingItem) {
        const { nameUa, nameEn } = getDisplayNames(currentData?.translations || [])
        const hasFormChanges = !!(nameUa && nameEn && currentData?.colorHex)
        return hasFormChanges
      }

      if (!currentData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: editingNameUa, nameEn: editingNameEn } = getDisplayNames(editingItem.translations || [])

      const namesChanged = editingNameUa !== currentNameUa || editingNameEn !== currentNameEn
      const colorHexChanged = editingItem.colorHex !== currentData.colorHex
      const translationsChanged = !arraysEqual(editingItem.translations || [], currentData.translations || [])

      return namesChanged || colorHexChanged || translationsChanged
    },
    [editingGroup, newItemData, tasteGroups]
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
        const tasteData = {
          translations: newItemData[groupId]?.translations || editingGroup.editingItem.translations,
          colorHex: newItemData[groupId]?.colorHex || editingGroup.editingItem.colorHex || '',
        }

        try {
          await updateTaste({
            groupId: editingGroup.editingItem.id,
            newTaste: tasteData,
          })
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to update taste:', error)
        }
      } else if (newItemData[groupId]) {
        const tasteData = {
          groupId: parseInt(groupId),
          translations: newItemData[groupId].translations,
          colorHex: newItemData[groupId].colorHex || '',
        }

        try {
          await createTaste({ groupId, tasteData })
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to create taste:', error)
        }
      }
    },
    [editingGroup, newItemData, updateTaste, createTaste, setEditingGroup, setNewItemData, hasChanges]
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
    (groupId: string, field: 'name' | 'nameEn' | 'colorHex' | 'translations', value: string | NameDictionary[]) => {
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

      const { nameUa: subgroupNameUa, nameEn: subgroupNameEn } = getDisplayNames(data.translations || [])

      if (!subgroupNameUa?.trim() || !subgroupNameEn?.trim() || !data.colorHex) {
        return false
      }

      const isEditingItem = editingGroup?.groupId === groupId && editingGroup?.editingItem
      if (isEditingItem) {
        return hasChanges(groupId)
      }

      return true
    },
    [newItemData, editingGroup, hasChanges]
  )

  const getItemName = useCallback((item: WineTasteItem) => {
    const { nameUa } = getDisplayNames(item.translations || [])
    return nameUa || ''
  }, [])

  const handleReorderTaste = useCallback(
    async (groupId: string, reorderedTaste: WineTasteItem[]) => {
      store.reorderTastes(groupId, reorderedTaste)
      const reorderParams = reorderedTaste.map((t, index) => ({
        id: Number(t.id),
        sortNumber: index,
      }))

      await reorderTaste(reorderParams)
    },
    [reorderTaste]
  )

  const getTasteForGroup = useCallback(
    (groupId: string) => {
      const group = tasteGroups?.find(g => g.id === groupId)

      return group?.flavors || []
    },
    [tasteGroups]
  )

  return {
    handleAddAromaClick,
    handleEditItem,
    onRemoveItem,
    handleSaveItem,
    handleCancelItemEdit,
    updateItemFormData,
    canAddItem,
    getItemName,

    handleReorderTaste,
    getTasteForGroup,

    hasChanges,
  }
}
