import { useCallback, useState } from 'react'
import { useWineColor } from './useWineColors'
import { EditingGroupState, NewShadeData } from '../entities/types/color-palette-types'
import { CreateShadesParams, WineShades } from '../entities/types/color-types'

interface UseColorItemsProps {
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useColorItems = ({ editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions }: UseColorItemsProps) => {
  const { createShade, updateShade, deleteShade } = useWineColor()

  //---------------для реодер пока нет бека -----------
  const [localShadesOrder, setLocalShadesOrder] = useState<Record<string, WineShades[]>>({})
  //------------------------------------------------------

  const handleAddShadeClick = useCallback(
    (groupId: string) => {
      if (newItemData[groupId]) {
        setNewItemData((prev: Record<string, NewShadeData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
      } else {
        setNewItemData((prev: Record<string, NewShadeData>) => ({
          ...prev,
          [groupId]: {
            nameUa: '',
            nameEn: '',
            tonePale: '',
            toneMedium: '',
            toneDeep: '',
            colorHex: '',
            sortNumber: 0,
          },
        }))
        if (editingGroup?.groupId === groupId && editingGroup.isEditingGroup) {
          setEditingGroup(null)
        }
      }
    },
    [editingGroup, newItemData, setEditingGroup, setNewItemData]
  )

  const handleEditItem = useCallback(
    (groupId: string, shade?: WineShades) => {
      if (!shade) return

      setEditingGroup({
        groupId,
        editingItem: shade,
        isEditingGroup: false,
      })

      setNewItemData((prev: Record<string, NewShadeData>) => ({
        ...prev,
        [groupId]: {
          nameUa: shade.nameUa || '',
          nameEn: shade.nameEn || '',
          tonePale: shade.tonePale || '',
          toneMedium: shade.toneMedium || '',
          toneDeep: shade.toneDeep || '',
          colorHex: shade.colorHex || '',
          sortNumber: shade.sortNumber || 0,
        },
      }))

      if (!openAccordions.has(groupId)) {
        setOpenAccordions((prev: Set<string>) => new Set(prev).add(groupId))
      }
    },
    [openAccordions, setEditingGroup, setNewItemData, setOpenAccordions]
  )

  const onRemoveItem = useCallback(
    async (groupId: string, shadeId: string) => {
      try {
        const isEditingCurrentItem = editingGroup?.groupId === groupId && editingGroup?.editingItem?.id === shadeId

        await deleteShade({ groupId, shadeId })

        if (isEditingCurrentItem) {
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewShadeData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        }
      } catch (error) {
        console.error('Failed to delete shade:', error)
      }
    },
    [deleteShade, editingGroup, setEditingGroup, setNewItemData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const editingItem = editingGroup?.editingItem
      const currentData = newItemData[groupId]

      if (!editingItem) {
        return !!(currentData?.nameUa && currentData?.nameEn && currentData?.colorHex)
      }

      if (!currentData) return false

      return (
        editingItem.nameUa !== currentData.nameUa ||
        editingItem.nameEn !== currentData.nameEn ||
        editingItem.tonePale !== currentData.tonePale ||
        editingItem.toneMedium !== currentData.toneMedium ||
        editingItem.toneDeep !== currentData.toneDeep ||
        editingItem.colorHex !== currentData.colorHex
      )
    },
    [editingGroup, newItemData]
  )

  const handleSaveItem = useCallback(
    async (groupId: string) => {
      setEditingGroup(null)
      setNewItemData((prev: Record<string, NewShadeData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })

      if (editingGroup?.editingItem && editingGroup.groupId === groupId) {
        const shadeData: CreateShadesParams = {
          nameUa: newItemData[groupId]?.nameUa || editingGroup.editingItem.nameUa,
          nameEn: newItemData[groupId]?.nameEn || editingGroup.editingItem.nameEn,
          tonePale: newItemData[groupId]?.tonePale || editingGroup.editingItem.tonePale,
          toneMedium: newItemData[groupId]?.toneMedium || editingGroup.editingItem.toneMedium,
          toneDeep: newItemData[groupId]?.toneDeep || editingGroup.editingItem.toneDeep,
          colorHex: newItemData[groupId]?.colorHex || editingGroup.editingItem.colorHex,
          sortNumber: editingGroup.editingItem.sortNumber,
        }

        try {
          await updateShade({ groupId, shadeId: editingGroup.editingItem.id, newShades: shadeData })
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewShadeData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to update shade:', error)
        }
      } else if (newItemData[groupId]) {
        const shadeData: CreateShadesParams = {
          nameUa: newItemData[groupId].nameUa,
          nameEn: newItemData[groupId].nameEn,
          tonePale: newItemData[groupId].tonePale,
          toneMedium: newItemData[groupId].toneMedium,
          toneDeep: newItemData[groupId].toneDeep,
          colorHex: newItemData[groupId].colorHex,
          sortNumber: newItemData[groupId].sortNumber || 0,
        }

        try {
          await createShade({ groupId, shadeData })
          setNewItemData((prev: Record<string, NewShadeData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to create shade:', error)
        }
      }
    },
    [editingGroup, newItemData, updateShade, createShade, setEditingGroup, setNewItemData, hasChanges]
  )

  const handleCancelItemEdit = useCallback(
    (groupId: string) => {
      setEditingGroup((prev: EditingGroupState | null) => (prev?.groupId === groupId ? null : prev))
      setNewItemData((prev: Record<string, NewShadeData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })
    },
    [setEditingGroup, setNewItemData]
  )

  const updateItemFormData = useCallback(
    (groupId: string, field: keyof CreateShadesParams, value: string) => {
      setNewItemData((prev: Record<string, NewShadeData>) => {
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
      if (!data) {
        return false
      }
      const hasRequiredFields = data.nameUa?.trim() && data.nameEn?.trim() && data.tonePale?.trim() && data.toneMedium?.trim() && data.toneDeep?.trim() && data.colorHex?.trim()

      if (!hasRequiredFields) {
        return false
      }

      const isEditingItem = editingGroup?.groupId === groupId && editingGroup?.editingItem
      if (isEditingItem) {
        const hasChangesResult = hasChanges(groupId)
        return hasChangesResult
      }

      return true
    },
    [newItemData, editingGroup, hasChanges]
  )

  const getItemName = useCallback((item: WineShades) => {
    return item.nameUa || ''
  }, [])

  //--------------------------reorder локальній пока нет бека-----------------------------------------------
  const handleReorderShades = useCallback((groupId: string, reorderedShades: WineShades[]) => {
    setLocalShadesOrder(prev => ({
      ...prev,
      [groupId]: reorderedShades.map((shade, index) => ({
        ...shade,
        sortNumber: index,
      })),
    }))

    console.log(
      'Reordered shades for group',
      groupId,
      ':',
      reorderedShades.map(s => ({ id: s.id, name: s.nameUa, sort: s.sortNumber }))
    )
    // ------------когда будет бек---------------
    // await reorderShades({ colorId: groupId, shadeIds: reorderedShades.map(s => s.id) })
  }, [])

  const getShadesForGroup = useCallback(
    (groupId: string, originalShades: WineShades[]) => {
      if (localShadesOrder[groupId]) {
        return localShadesOrder[groupId]
      }
      // ------------когда будет бек---------------
      return originalShades
    },
    [localShadesOrder]
  )

  //----------------------------------------------------------------------------------------------------------

  return {
    handleAddShadeClick,
    handleEditItem,
    onRemoveItem,
    handleSaveItem,
    handleCancelItemEdit,
    updateItemFormData,
    canAddItem,
    getItemName,
    handleReorderShades,
    getShadesForGroup,
  }
}
