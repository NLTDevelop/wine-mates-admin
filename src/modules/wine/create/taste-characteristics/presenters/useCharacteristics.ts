import { useCallback } from 'react'
import { useTasteCharacteristics } from './useTasteCharacteristics'
import { BaseWineColor } from '../../general/entities/types'
import { arraysEqual, getDisplayNameDescription } from '@/lib/utils'
import { CreateWineTasteCharacteristicParams, CreateWineTasteCharacteristicRequest, LevelItem, UpdateWineTasteCharacteristicRequest, WineTasteCharacteristics } from '../entities/taste-characteristics'
import { NewCharacteristicData } from '../entities/characteristics-palette-types'
import { convertToUpdateTranslations } from '../../general/presenters/helper'

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
  const { isLoading, isCreating, isUpdating, isDeleting, createTasteCharacteristics, updateTasteCharacteristics, deleteTasteCharacteristics } = useTasteCharacteristics(cachedColors)

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
      return nameUa && nameEn && data?.colorHex && data?.levels && data?.levels.length > 2 && data.colors && data.colors.length
    },
    [editingCharacteristicData]
  )

  const hasChanges = useCallback(
    (characteristicId: string): boolean => {
      const originalCharacteristic = tasteCharacteristics?.find((tc: WineTasteCharacteristics) => tc?.id === characteristicId)
      const currentFormData = editingCharacteristicData[characteristicId]

      if (!originalCharacteristic || !currentFormData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNameDescription(currentFormData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNameDescription(originalCharacteristic.translations || [])

      const nameChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn

      const originalColorIds = originalCharacteristic.colors?.map((c: BaseWineColor) => c?.id) || []
      const currentColorIds = currentFormData.colors?.map(c => c?.id) || []
      const colorsChanged = JSON.stringify(originalColorIds.sort()) !== JSON.stringify(currentColorIds.sort())
      const translationsChanged = !arraysEqual(originalCharacteristic.translations || [], currentFormData.translations || [])
      const colorHexChanged = currentFormData.colorHex !== originalCharacteristic.colorHex
      const levelsChanged = !areLevelsEqual(originalCharacteristic.levels || [], currentFormData.levels || [])

      return nameChanged || colorsChanged || translationsChanged || colorHexChanged || levelsChanged
    },
    [tasteCharacteristics, editingCharacteristicData]
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

    canSave,
    hasChanges,
  }
}

const areLevelsEqual = (levels1: LevelItem[], levels2: LevelItem[]): boolean => {
  if (levels1.length !== levels2.length) {
    return false
  }

  const sorted1 = [...levels1].sort((x, y) => String(x.id ?? '').localeCompare(String(y.id ?? '')))

  const sorted2 = [...levels2].sort((x, y) => String(x.id ?? '').localeCompare(String(y.id ?? '')))

  return sorted1.every((level1, index) => {
    const level2 = sorted2[index]

    if (level1.id !== level2.id) {
      return false
    }

    const translationsEqual = arraysEqual(level1.translations || [], level2.translations || [])
    if (!translationsEqual) {
      return false
    }

    const isShowed1 = level1.isEnabled ?? true
    const isShowed2 = level2.isEnabled ?? true
    if (isShowed1 !== isShowed2) {
      return false
    }

    return true
  })
}
