import { useState, useCallback } from 'react'
import { WineTasteCharacteristics } from '../entities/types/taste-characteristics'

interface UseEditTasteCharacteristicProps {
  data: WineTasteCharacteristics
  isEditable: boolean
  isFormOpen: boolean
  onCancel: (id: string) => void
  onToggleForm?: () => void
  onUpdateCharacteristic: (id: string, updates: { label?: string; labelEn?: string }) => Promise<void | WineTasteCharacteristics>
}

export const useEditTasteCharacteristic = ({ data, isEditable,  onCancel, onToggleForm, onUpdateCharacteristic }: UseEditTasteCharacteristicProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editValue, setEditValue] = useState({
    label: data.label,
    labelEn: data.labelEn || '',
  })

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValue({
      label: data.label,
      labelEn: data.labelEn || '',
    })
  }, [isEditable, data.label, data.labelEn])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValue({
      label: data.label,
      labelEn: data.labelEn || '',
    })
    onCancel(data.id)
  }, [data.label, data.labelEn, data.id, onCancel])

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
    handleKeyDown,
    handleAddItemClick,
    getItemName,
    renderableItems,
  }
}
