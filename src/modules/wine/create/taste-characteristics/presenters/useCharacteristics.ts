import { useCallback } from 'react'
import { useTasteCharacteristics } from './useTasteCharacteristics'
import { BaseWineColor } from '../../general/entities/types'
import { getDisplayNameDescription } from '@/lib/utils'
import { CreateWineTasteCharacteristicParams, CreateWineTasteCharacteristicRequest, LevelItem, UpdateWineTasteCharacteristicRequest, WineTasteCharacteristics } from '../entities/taste-characteristics'
import { NewCharacteristicData } from '../entities/characteristics-palette-types'
import { convertToUpdateTranslations } from '../../general/presenters/helper'
import { areLevelsEqual, compareCharacteristicTranslations } from './compare-helper'

interface UseCharacteristicsProps {
  tasteCharacteristics: WineTasteCharacteristics[] | undefined
  editingCharacteristicData: Record<string, Partial<CreateWineTasteCharacteristicParams>>
  setEditingCharacteristic: (editingCharacteristic: any) => void
  setEditingCharacteristicData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewCharacteristicData: (data: any) => void
  cachedColors: BaseWineColor[]
}

export const useCharacteristics = ({
  tasteCharacteristics,
  editingCharacteristicData,
  setEditingCharacteristic,
  setEditingCharacteristicData,
  setForceOpenKeys,
  setOpenAccordions,
  setNewCharacteristicData,
  cachedColors,
}: UseCharacteristicsProps) => {
  const { isLoading, isCreating, isUpdating, isDeleting, createTasteCharacteristics, updateTasteCharacteristics, deleteTasteCharacteristics, reorderLevels } = useTasteCharacteristics(cachedColors)

  const handleAddCharacteristic = useCallback(
    async (characteristicData: CreateWineTasteCharacteristicRequest) => {
      try {
        await createTasteCharacteristics(characteristicData)
      } catch (error) {
        console.error('Failed to create taste characteristic:', error)
      }
    },
    [createTasteCharacteristics, tasteCharacteristics]
  )

  const startEditingCharacteristic = useCallback(
    (characteristicId: string) => {
      const group = tasteCharacteristics?.find((tc: WineTasteCharacteristics) => tc.id === characteristicId)
      if (!group) {
        console.error('Characteristic not found:', characteristicId)
        return
      }

      setNewCharacteristicData((prev: Record<string, NewCharacteristicData>) => {
        const newData = { ...prev }
        delete newData[characteristicId]
        return newData
      })

      setOpenAccordions((prev: Set<string>) => {
        const newSet = new Set(prev)
        newSet.add(characteristicId)
        return newSet
      })
      const characteristicFormData = {
        translations: group.translations || [],
        colorHex: group.colorHex || '',
        sortNumber: group.sortNumber || 0,
        levels: group.levels || [],
        colors: group.colors || [],
      }

      setEditingCharacteristicData((prev: Record<string, NewCharacteristicData>) => ({
        ...prev,
        [characteristicId]: characteristicFormData,
      }))

      setEditingCharacteristic({
        characteristicId,
        isEditingCharacteristic: true,
      })

      setForceOpenKeys((prev: Record<string, number>) => ({
        ...prev,
        [characteristicId]: (prev[characteristicId] || 0) + 1,
      }))
    },
    [tasteCharacteristics, setEditingCharacteristic, setEditingCharacteristicData, setForceOpenKeys, setOpenAccordions, setNewCharacteristicData]
  )

  const updateFormData = useCallback(
    (groupId: string, field: keyof CreateWineTasteCharacteristicParams, value: any) => {
      setEditingCharacteristicData((prev: Record<string, NewCharacteristicData>) => ({
        ...prev,
        [groupId]: {
          ...prev[groupId],
          [field]: value,
        },
      }))
    },
    [setEditingCharacteristicData]
  )

  const handleSaveCharacteristic = useCallback(
    async (characteristicId: string) => {
      const data = editingCharacteristicData[characteristicId]
      if (!data) return

      try {
        const currentGroupIndex = tasteCharacteristics?.findIndex((tc: WineTasteCharacteristics) => tc.id === characteristicId) ?? -1
        const updateData: UpdateWineTasteCharacteristicRequest = {
          colorHex: data.colorHex || '',
          levels: data.levels || [],
          colorIds: data.colors?.map((color: BaseWineColor) => color.id) || [],
          sortNumber: currentGroupIndex >= 0 ? currentGroupIndex : tasteCharacteristics?.length || 0,
          translations: convertToUpdateTranslations(data.translations),
          isPremium: false,
          qtyLevels: data.qtyLevels || 3,
        }

        await updateTasteCharacteristics({
          characteristicId,
          newCharacteristic: updateData,
        })
        setOpenAccordions((prev: Set<string>) => {
          const newSet = new Set(prev)
          newSet.delete(characteristicId)
          return newSet
        })
        setEditingCharacteristic(null)
        setEditingCharacteristicData((prev: Record<string, NewCharacteristicData>) => {
          const newData = { ...prev }
          delete newData[characteristicId]
          return newData
        })
      } catch (error) {
        console.error('Failed to update characteristic:', error)
      }
    },
    [updateTasteCharacteristics, editingCharacteristicData, setEditingCharacteristic, setEditingCharacteristicData, tasteCharacteristics]
  )

  const handleCancelCharacteristicEdit = useCallback(
    (characteristicId: string) => {
      setEditingCharacteristic(null)
      setEditingCharacteristicData((prev: Record<string, NewCharacteristicData>) => {
        const newData = { ...prev }
        delete newData[characteristicId]
        return newData
      })
    },
    [setEditingCharacteristic, setEditingCharacteristicData]
  )

  const handleDeleteCharacteristic = useCallback(
    async (characteristicId: string) => {
      try {
        await deleteTasteCharacteristics(characteristicId)
      } catch (error) {
        console.error('Failed to delete characteristic:', error)
      }
    },
    [deleteTasteCharacteristics]
  )

  const canSave = useCallback(
    (characteristicId: string) => {
      const data = editingCharacteristicData[characteristicId]
      if (!data?.translations) return false

      const { nameUa, nameEn } = getDisplayNameDescription(data.translations)

      if (!nameUa || !nameEn || !data?.colorHex || !data?.levels || data?.levels.length < 2 || !data.colors || data.colors.length === 0) {
        return false
      }

      const allLevelsHaveTranslations = data.levels.every((level: LevelItem) => {
        if (!level.translations || level.translations.length < 2) return false

        const uaTranslation = level.translations.find(t => t.language === 'uk')
        const enTranslation = level.translations.find(t => t.language === 'en')

        return uaTranslation?.name?.trim() && enTranslation?.name?.trim()
      })

      return allLevelsHaveTranslations
    },
    [editingCharacteristicData]
  )

  const hasChanges = useCallback(
    (characteristicId: string): boolean => {
      const originalCharacteristic = tasteCharacteristics?.find((tc: WineTasteCharacteristics) => tc?.id === characteristicId)
      const currentFormData = editingCharacteristicData[characteristicId]

      if (!originalCharacteristic || !currentFormData) return false
      const translationsChanged = !compareCharacteristicTranslations(originalCharacteristic.translations, currentFormData.translations)

      const originalColorIds = originalCharacteristic.colors?.map((c: BaseWineColor) => c?.id).sort() || []
      const currentColorIds = currentFormData.colors?.map(c => c?.id).sort() || []
      const colorsChanged = JSON.stringify(originalColorIds) !== JSON.stringify(currentColorIds)
      const colorHexChanged = (currentFormData.colorHex || '') !== (originalCharacteristic.colorHex || '')
      const levelsChanged = !areLevelsEqual(originalCharacteristic.levels || [], currentFormData.levels || [])
      const qtyLevelsChanged = originalCharacteristic.qtyLevels === currentFormData.qtyLevels

      const hasChangesResult = translationsChanged || colorsChanged || colorHexChanged || levelsChanged || qtyLevelsChanged

      return hasChangesResult
    },
    [tasteCharacteristics, editingCharacteristicData]
  )

  const handleReorderLevels = useCallback(
    async (reorderedLevels: LevelItem[]) => {
      const reorderParams = reorderedLevels.map((level, index) => ({
        id: Number(level.id),
        sortNumber: index,
      }))

      await reorderLevels(reorderParams)
    },
    [reorderLevels]
  )

  return {
    tasteCharacteristics,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    updateFormData,
    handleAddCharacteristic,
    handleSaveCharacteristic,
    handleDeleteCharacteristic,
    startEditingCharacteristic,
    handleCancelCharacteristicEdit,
    handleReorderLevels,

    canSave,
    hasChanges,
  }
}
