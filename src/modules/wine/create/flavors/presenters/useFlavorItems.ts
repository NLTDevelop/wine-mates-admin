import { useCallback } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { WineAromaGroup, WineAromaItem, WineAromaSubgroup } from '../entities/types/flavor-types'
import { EditingGroupState, NewItemData } from '../entities/types/flavor-palette-types'
import { BaseWineColor, NameDictionary } from '../../general/entities/types'
import { areNestedArrEqual, arraysEqual, createTranslations, getDisplayNames } from '@/lib/utils'
import { useWineFlavorStore } from '../entities/wine-flavor-store'

interface UseFlavorItemsProps {
  aromaGroups: WineAromaGroup[] | undefined
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
  cachedColors: BaseWineColor[]
}

export const useFlavorItems = ({ aromaGroups, editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions, cachedColors }: UseFlavorItemsProps) => {
  const { createSubgroup, updateSubgroup, deleteSubgroup, reorderSubgroup, reorderAromas } = useWineFlavor(cachedColors)

  const store = useWineFlavorStore()

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
          [groupId]: { translations: createTranslations('', ''), aromas: [], colorHex: '' },
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
          translations: item.translations || [],
          aromas: item.aromas || [],
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
    async (groupId: string, subgroupId: string) => {
      try {
        const isEditingCurrentItem = editingGroup?.groupId === groupId && editingGroup?.editingItem?.id === subgroupId

        await deleteSubgroup({ groupId, subgroupId })

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
    [deleteSubgroup, editingGroup, setEditingGroup, setNewItemData]
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
      const aromasChanged = !areNestedArrEqual(editingItem.aromas || [], currentData.aromas || [])
      const translationsChanged = !arraysEqual(editingItem.translations || [], currentData.translations || [])

      return namesChanged || colorHexChanged || aromasChanged || translationsChanged
    },
    [editingGroup, newItemData, aromaGroups]
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
        const cleanAromas = (aromas: WineAromaItem[] | undefined) => {
          return aromas?.map(({ sortNumber, ...aroma }) => aroma) || []
        }

        const subgroupData = {
          translations: newItemData[groupId]?.translations || editingGroup.editingItem.translations,
          aromas: cleanAromas(newItemData[groupId]?.aromas) || cleanAromas(editingGroup.editingItem.aromas),
          colorHex: newItemData[groupId]?.colorHex || editingGroup.editingItem.colorHex || '',
        }

        try {
          await updateSubgroup({
            subgroupId: editingGroup.editingItem.id,
            newSubgroup: subgroupData,
          })
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
          groupId: parseInt(groupId),
          translations: newItemData[groupId].translations,
          aromas: newItemData[groupId].aromas || [],
          // sortNumber: 0,
          colorHex: newItemData[groupId].colorHex || '',
        }

        try {
          await createSubgroup({ groupId, subgroupData })
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
    [editingGroup, newItemData, updateSubgroup, createSubgroup, setEditingGroup, setNewItemData, hasChanges]
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
    (groupId: string, field: 'name' | 'nameEn' | 'colorHex' | 'translations' | 'aromas', value: string | NameDictionary[]) => {
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

      if (data.aromas && data.aromas.length > 0) {
        const hasInvalidAromas = data.aromas.some((aroma: WineAromaItem) => {
          const { nameUa: aromaNameUa, nameEn: aromaNameEn } = getDisplayNames(aroma.translations || [])
          return !aromaNameUa?.trim() || !aromaNameEn?.trim()
        })
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

  const getItemName = useCallback((item: WineAromaSubgroup) => {
    const { nameUa } = getDisplayNames(item.translations || [])
    return nameUa || ''
  }, [])

  const handleReorderSubgr = useCallback(
    async (groupId: string, reorderedSubgr: WineAromaSubgroup[]) => {
      store.reorderSubgroups(groupId, reorderedSubgr)
      const reorderParams = reorderedSubgr.map((subgroup, index) => ({
        id: Number(subgroup.id),
        sortNumber: index,
      }))

      await reorderSubgroup(reorderParams)
    },
    [reorderSubgroup]
  )

  const getSubgroupForGroup = useCallback(
    (groupId: string) => {
      const group = aromaGroups?.find(g => g.id === groupId)

      return group?.subgroups || []
    },
    [aromaGroups]
  )

  const handleReorderAromas = useCallback(
    async (reorderedAromas: WineAromaItem[]) => {
      const reorderParams = reorderedAromas.map((aroma, index) => ({
        id: Number(aroma.id),
        sortNumber: index,
      }))

      await reorderAromas(reorderParams)
    },
    [reorderAromas]
  )

  const getAromasForGroup = useCallback((originalAromas: WineAromaItem[]) => {
    return originalAromas
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

    // handleReorderSubgr: handleReorderLocale,
    handleReorderSubgr, //когда будет бек
    getSubgroupForGroup,

    // handleReorderAromas: handleReorderAromasLocale,
    handleReorderAromas, //когда будет бек
    getAromasForGroup,

    hasChanges,
  }
}
