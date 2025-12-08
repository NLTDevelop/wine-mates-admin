import { useCallback } from 'react'
import { useWineColor } from './useWineColors'
import { EditingGroupState, NewShadeData } from '../entities/types/color-palette-types'
import { CreateShadesParams, WineColorGroup, WineShades } from '../entities/types/color-types'
import { arraysEqual, createTranslations, getDisplayNames } from '@/lib/utils'
import { NameDictionary } from '../../general/entities/types'
import { useWineColorStore } from '../entities/wine-color-store'

interface UseColorItemsProps {
  colorGroups: WineColorGroup[] | undefined
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useColorItems = ({ editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions, colorGroups }: UseColorItemsProps) => {
  const { createShade, updateShade, deleteShade, reorderShades } = useWineColor()

  const store = useWineColorStore()

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
            translations: createTranslations('', ''),
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
          translations: shade.translations || [],
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

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: editingNameUa, nameEn: editingNameEn } = getDisplayNames(editingItem.translations || [])

      const namesChanged = editingNameUa !== currentNameUa || editingNameEn !== currentNameEn
      const tonesChanged = editingItem.tonePale !== currentData.tonePale || editingItem.toneMedium !== currentData.toneMedium || editingItem.toneDeep !== currentData.toneDeep
      const colorHexChanged = editingItem.colorHex !== currentData.colorHex
      const translationsChanged = !arraysEqual(editingItem.translations || [], currentData.translations || [])

      return namesChanged || tonesChanged || colorHexChanged || translationsChanged
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
          translations: newItemData[groupId]?.translations || editingGroup.editingItem.translations,
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
          translations: newItemData[groupId].translations,
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
    (groupId: string, field: keyof CreateShadesParams, value: string | NameDictionary[]) => {
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

      const { nameUa, nameEn } = getDisplayNames(data.translations || [])
      const hasRequiredFields = nameUa?.trim() && nameEn?.trim() && data.tonePale?.trim() && data.toneMedium?.trim() && data.toneDeep?.trim() && data.colorHex?.trim()

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
    const { nameUa } = getDisplayNames(item.translations || [])
    return nameUa || ''
  }, [])

  const handleReorderShades = useCallback(
    async (groupId: string, reorderedShades: WineShades[]) => {
      store.reorderShades(groupId, reorderedShades)
      const reorderParams = reorderedShades.map((shade, index) => ({
        id: Number(shade.id),
        sortNumber: index,
      }))

      await reorderShades(reorderParams)
    },
    [reorderShades]
  )

  const getShadesForGroup = useCallback(
    (groupId: number) => {
      const group = colorGroups?.find((g: WineColorGroup) => Number(g.id) === groupId)

      return group?.shades || []
    },
    [colorGroups]
  )

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
