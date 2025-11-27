import { useCallback, useState } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { WineAromaGroup, WineAromaItem, WineAromaSubgroup } from '../entities/types/flavor-types'
import { EditingGroupState, NewItemData } from '../entities/types/flavor-palette-types'
import { BaseWineColor, NameDictionary } from '../../general/entities/types'
import { areNestedArrEqual, arraysEqual, createTranslations, getDisplayNames } from '@/lib/utils'

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
  const { createSubgroup, updateSubgroup, deleteSubgroup /*reorderSubgroup, reorderAromas*/ } = useWineFlavor(cachedColors)

  //---------------для реодер пока нет бека -----------
  const [localSubgroupOrder, setLocalSubgroupOrder] = useState<Record<string, WineAromaSubgroup[]>>({})
  const [localAromaOrder, setLocalAromaOrder] = useState<Record<string, WineAromaItem[]>>({})
  //------------------------------------------------------

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

      const hasSubgroupReorderChanges = !!localSubgroupOrder[groupId]

      const subgroup = aromaGroups?.find(g => g.id === groupId)?.subgroups?.[0]
      const hasAromaReorderChanges = subgroup ? !!localAromaOrder[subgroup.id] : false

      if (!editingItem) {
        const { nameUa, nameEn } = getDisplayNames(currentData?.translations || [])
        const hasFormChanges = !!(nameUa && nameEn && currentData?.colorHex)
        return hasFormChanges || hasSubgroupReorderChanges || hasAromaReorderChanges
      }

      if (!currentData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: editingNameUa, nameEn: editingNameEn } = getDisplayNames(editingItem.translations || [])

      const namesChanged = editingNameUa !== currentNameUa || editingNameEn !== currentNameEn
      const colorHexChanged = editingItem.colorHex !== currentData.colorHex
      const aromasChanged = !areNestedArrEqual(editingItem.aromas || [], currentData.aromas || [])
      const translationsChanged = !arraysEqual(editingItem.translations || [], currentData.translations || [])

      return namesChanged || colorHexChanged || aromasChanged || translationsChanged || hasSubgroupReorderChanges || hasAromaReorderChanges
    },
    [editingGroup, newItemData, localSubgroupOrder, localAromaOrder, aromaGroups]
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
          translations: newItemData[groupId]?.translations || editingGroup.editingItem.translations,
          aromas: newItemData[groupId]?.aromas || editingGroup.editingItem.aromas || [],
          sortNumber: editingGroup.editingItem.sortNumber,
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
          sortNumber: 0,
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

  //--------------------------reorder локальній пока нет бека-----------------------------------------------
  const handleReorderLocale = useCallback((groupId: string, reorderedItem: WineAromaSubgroup[]) => {
    console.log(
      'Before reorder:',
      reorderedItem.map(s => ({
        name: getDisplayNames(s.translations || []).nameUa,
        originalSort: s.sortNumber,
      }))
    )

    const updatedItem = reorderedItem.map((subgroup, newIndex) => ({
      ...subgroup,
      sortNumber: newIndex,
    }))

    setLocalSubgroupOrder(prev => ({
      ...prev,
      [groupId]: updatedItem,
    }))

    console.log(
      'After reorder:',
      updatedItem.map(s => ({
        name: getDisplayNames(s.translations || []).nameUa,
        newSort: s.sortNumber,
      }))
    )
  }, [])
  // ----------------------------------------------------------------------------------------------

  // ------------когда будет бек---------------
  //   const handleReorderSubgr = useCallback(
  //     async (groupId: string, reorderedSubgr: WineAromaSubgroup[]) => {
  //           const subgroupIds = reorderedSubgr.map(s => s.id)
  //           await reorderSubgroup({ groupId, subgroupIds })
  //         },
  //         [reorderSubgroup]
  // )
  // -----------------------------------

  const getSubgroupForGroup = useCallback(
    (groupId: string, originalShades: WineAromaSubgroup[]) => {
      //---------------для локали----------------
      if (localSubgroupOrder[groupId]) {
        return localSubgroupOrder[groupId]
      }
      // ------------когда будет бек---------------
      return originalShades
    },
    [localSubgroupOrder]
  )

  //----------------------------------------------------------------------------------------------------------

  //---------------реордер ароматов -----------
  const handleReorderAromasLocale = useCallback((subgrId: string, reorderedAromas: WineAromaItem[]) => {
    console.log(
      'Before aroma reorder:',
      subgrId,
      reorderedAromas.map(a => ({
        name: getDisplayNames(a.translations || []).nameUa,
        originalSort: a.sortNumber,
      }))
    )

    const updatedAromas = reorderedAromas.map((aroma, newIndex) => ({
      ...aroma,
      sortNumber: newIndex,
    }))

    setLocalAromaOrder(prev => ({
      ...prev,
      [subgrId]: updatedAromas,
    }))

    console.log(
      'After aroma reorder:',
      updatedAromas.map(a => ({
        name: getDisplayNames(a.translations || []).nameUa,
        newSort: a.sortNumber,
      }))
    )
  }, [])

  // ------------когда будет бек---------------
  //   const handleReorderAromas = useCallback(
  //     async (subgrId: string, reorderedAromas: WineAromaItem[]) => {
  //           const aromasIds = reorderedAromas.map(a => a.id).filter((id): id is string => id !== undefined)
  //           await reorderAromas({ subgrId, aromasIds })
  //         },
  //         [reorderAromas]
  // )
  // -----------------------------------

  const getAromasForGroup = useCallback(
    (subgrId: string, originalAromas: WineAromaItem[]) => {
      if (localAromaOrder[subgrId]) {
        return localAromaOrder[subgrId]
      }
      return originalAromas
    },
    [localAromaOrder]
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

    handleReorderSubgr: handleReorderLocale,
    // handleReorderSubgr,//когда будет бек
    getSubgroupForGroup,

    handleReorderAromas: handleReorderAromasLocale,
    // handleReorderAromas,//когда будет бек
    getAromasForGroup,

    hasChanges,
  }
}
