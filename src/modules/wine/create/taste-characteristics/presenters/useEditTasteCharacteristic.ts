import { useState, useCallback } from 'react'
import { WineTasteCharacteristics, LevelItem } from '../entities/types/taste-characteristics'

interface UseEditTasteCharacteristicProps {
  data: WineTasteCharacteristics
  isEditable: boolean
  isFormOpen: boolean
  onCancel: (id: string) => void
  onToggleForm?: () => void
  onUpdateCharacteristic: (id: string, updates: { label?: string; labelEn?: string }) => Promise<void | WineTasteCharacteristics>
  onSaveLevelsOrder?: (levels: LevelItem[]) => Promise<void> 
   onCloseAccordion?: () => void
}

export const useEditTasteCharacteristic = ({ 
  data, 
  isEditable,  
  onCancel, 
  onToggleForm, 
  onUpdateCharacteristic,
  onSaveLevelsOrder , onCloseAccordion
}: UseEditTasteCharacteristicProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editValue, setEditValue] = useState({
    label: data.label,
    labelEn: data.labelEn || '',
  })
  const [originalLevels, setOriginalLevels] = useState<LevelItem[]>(data.levels || []) 
  const [currentLevels, setCurrentLevels] = useState<LevelItem[]>(data.levels || []) 

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValue({
      label: data.label,
      labelEn: data.labelEn || '',
    })
    setOriginalLevels(data.levels || [])
    setCurrentLevels(data.levels || [])
  }, [isEditable, data.label, data.labelEn, data.levels])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValue({
      label: data.label,
      labelEn: data.labelEn || '',
    })
    setCurrentLevels(originalLevels)
    onCancel(data.id)
  }, [data.label, data.labelEn, data.id, onCancel, originalLevels])

  const handleSaveLabel = useCallback(async () => {
    if (!editValue.label.trim()) return

    setIsSaving(true)
    try {
      await onUpdateCharacteristic(data.id, {
        label: editValue.label,
        labelEn: editValue.labelEn,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save characteristic:', error)
    } finally {
      setIsSaving(false)
    }
  }, [editValue.label, editValue.labelEn, data.id, onUpdateCharacteristic])


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
        handleSaveLabel()
      } else if (e.key === 'Escape') {
        cancelEditing()
      }
    },
    [handleSaveLabel, cancelEditing]
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

  return {
    isEditing,
    isSaving,
    editValue,
    setEditValue,
    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleSaveLevelsOrder, 
    updateCurrentLevels, 
    handleKeyDown,
    handleAddItemClick,
    getItemName,
    renderableItems,
    currentLevels,
  }
}