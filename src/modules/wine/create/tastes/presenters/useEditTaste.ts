import { useState, useCallback, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { WineTaste } from '../entities/types/tastes'
import { tasteQueries } from '../entities/wine-taste-queries'


interface UseEditTasteProps {
  data: WineTaste
  isEditable?: boolean
  isFormOpen?: boolean
  onCancel?: (id: string) => void
  onToggleForm?: () => void
}

interface UseEditTasteReturn {
  isEditing: boolean
  editValue: {
    label: string
    labelEn: string
    value: string
  }
  color: string
  cardTextColorClass: string
  isSaving: boolean
  startEditing: () => void
  handleSaveLabel: (editData: { label: string; labelEn: string; value: string }) => Promise<void>
  cancelEditing: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  setEditValue: (field: string, value: string) => void
}

export const useEditTaste = ({ 
  data, 
  isEditable = false, 
}: UseEditTasteProps): UseEditTasteReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValueState] = useState({
    label: data.label,
    labelEn: data.labelEn || '',
    value: data.value
  })

  const queryClient = useQueryClient()

  const color = data.value?.[0] === '#' ? data.value : '#ffffff'
  const { textColorClass: cardTextColorClass } = useContrastText(color)

  const updateTasteMutation = useMutation({
    ...tasteQueries.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tastes', 'list'] })
    },
  })

  const handleSaveLabel = useCallback(
    async (editData: { label: string; labelEn: string; value: string }) => {
      if (!data.id) return

      await updateTasteMutation.mutateAsync({
        tasteId: data.id,
        newTaste: {
          label: editData.label,
          labelEn: editData.labelEn,
          value: editData.value,
        },
      })

      setIsEditing(false)
    },
    [data.id, updateTasteMutation]
  )

  const setEditValue = useCallback((field: string, value: string) => {
    setEditValueState(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValueState({
      label: data.label,
      labelEn: data.labelEn || '',
      value: data.value
    })
  }, [data.label, data.labelEn, data.value, isEditable])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValueState({
      label: data.label,
      labelEn: data.labelEn || '',
      value: data.value
    })
  }, [data.label, data.labelEn, data.value])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveLabel(editValue)
      } else if (e.key === 'Escape') {
        cancelEditing()
      }
    },
    [handleSaveLabel, cancelEditing, editValue]
  )


  return {
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    isSaving: updateTasteMutation.isPending,

    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    setEditValue,
  }
}