import { useState, useCallback } from 'react'
import { WineTasteCharacteristics, LevelItem, CreateWineTasteCharacteristicParams } from '../entities/types/taste-characteristics'
import { BaseWineColor } from '../../general/entities/types'

interface UseEditTasteCharacteristicProps {
  data: WineTasteCharacteristics
  isEditable: boolean
  isFormOpen: boolean
  onCancel: (id: string) => void
  onToggleForm?: () => void
  onUpdateCharacteristic: (id: string, updates: Partial<CreateWineTasteCharacteristicParams>) => Promise<void | WineTasteCharacteristics>
  onSaveLevelsOrder?: (levels: LevelItem[]) => Promise<void>
  onCloseAccordion?: () => void
  fetchColors?: () => Promise<BaseWineColor[]>
}

export const useEditTasteCharacteristic = ({ data, isEditable, onCancel, onToggleForm, onUpdateCharacteristic, onSaveLevelsOrder, onCloseAccordion, fetchColors }: UseEditTasteCharacteristicProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editValue, setEditValue] = useState<Partial<CreateWineTasteCharacteristicParams>>({
    nameUa: data.nameUa,
    nameEn: data.nameEn || '',
    colors: data.colors || [],
  })
  const [originalLevels, setOriginalLevels] = useState<LevelItem[]>(data.levels || [])
  const [currentLevels, setCurrentLevels] = useState<LevelItem[]>(data.levels || [])

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValue({
      nameUa: data.nameUa,
      nameEn: data.nameEn || '',
      colors: data.colors || [],
    })
    setOriginalLevels(data.levels || [])
    setCurrentLevels(data.levels || [])
  }, [isEditable, data.nameUa, data.nameEn, data.levels])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValue({
      nameUa: data.nameUa,
      nameEn: data.nameEn || '',
      colors: data.colors || [],
    })
    setCurrentLevels(originalLevels)
    onCancel(data.id)
  }, [data.nameUa, data.nameEn, data.id, onCancel, originalLevels])

  const handleColorChange = useCallback(
    async (value: string | string[]) => {
      if (!fetchColors) return

      const selectedValues = Array.isArray(value) ? value : [value]
      const allColors = await fetchColors()
      const selectedColorObjects = allColors.filter(color => selectedValues.includes(color.id))

      setEditValue(prev => ({
        ...prev,
        colors: selectedColorObjects,
      }))
    },
    [fetchColors]
  )

  const handleSaveNameUa = useCallback(async () => {
    if (!editValue.nameUa?.trim()) return

    setIsSaving(true)
    try {
      await onUpdateCharacteristic(data.id, {
        nameUa: editValue.nameUa,
        nameEn: editValue.nameEn,
        colors: editValue.colors,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save characteristic:', error)
    } finally {
      setIsSaving(false)
    }
  }, [editValue.nameUa, editValue.nameEn, data.id, onUpdateCharacteristic])

  const handleSaveLevelsOrder = useCallback(async () => {
    if (!onSaveLevelsOrder) return

    setIsSaving(true)
    try {
      await onSaveLevelsOrder(currentLevels)
      setOriginalLevels(currentLevels)

      if (onCloseAccordion) {
        onCloseAccordion()
      }
    } catch (error) {
      console.error('Failed to save levels order:', error)
    } finally {
      setIsSaving(false)
    }
  }, [currentLevels, onSaveLevelsOrder, onCloseAccordion])

  const updateCurrentLevels = useCallback((levels: LevelItem[]) => {
    setCurrentLevels(levels)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveNameUa()
      } else if (e.key === 'Escape') {
        cancelEditing()
      }
    },
    [handleSaveNameUa, cancelEditing]
  )

  const handleAddItemClick = useCallback(() => {
    if (isEditing) {
      cancelEditing()
    }
    onToggleForm?.()
  }, [isEditing, cancelEditing, onToggleForm])

  const getItemName = useCallback((item: any) => {
    return item.name || item.nameEn
  }, [])

  const renderableItems = data.levels || []

  const selectedColors = editValue.colors || []
  const colorValues = selectedColors.map(color => color.id)

  return {
    isEditing,
    isSaving,
    editValue,
    selectedColors,
    colorValues,

    handleColorChange,
    setEditValue,
    startEditing,
    cancelEditing,
    handleSaveNameUa,
    handleSaveLevelsOrder,
    updateCurrentLevels,
    handleKeyDown,
    handleAddItemClick,
    getItemName,
    renderableItems,
    currentLevels,
  }
}
