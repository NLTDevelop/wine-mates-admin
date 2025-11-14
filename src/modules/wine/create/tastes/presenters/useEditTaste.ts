import { useState, useCallback, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { CreateWineTasteParams, WineTaste } from '../entities/types/tastes'
import { tasteQueries } from '../entities/wine-taste-queries'
import { BaseWineColor } from '../../general/entities/types'

interface UseEditTasteProps {
  data: WineTaste
  isEditable?: boolean
  isFormOpen?: boolean
  onCancel?: (id: string) => void
  onToggleForm?: () => void
  fetchColors?: () => Promise<BaseWineColor[]>
}

interface UseEditTasteReturn {
  isEditing: boolean
  editValue: Partial<CreateWineTasteParams>
  color: string
  cardTextColorClass: string
  isSaving: boolean
  startEditing: () => void
  handleSaveLabel: (editData: Partial<CreateWineTasteParams>) => Promise<void>
  cancelEditing: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  setEditValue: (field: string, value: string | BaseWineColor[]) => void
  selectedColors: BaseWineColor[]
  colorValues: string[]
  handleColorChange: (value: string | string[]) => Promise<void>
}

export const useEditTaste = ({ data, isEditable = false, fetchColors }: UseEditTasteProps): UseEditTasteReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValueState] = useState<Partial<CreateWineTasteParams>>({
    label: data.label,
    labelEn: data.labelEn || '',
    value: data.value,
    colors: data.colors || [],
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

  const handleColorChange = useCallback(
    async (value: string | string[]) => {
      if (!fetchColors) return

      const selectedValues = Array.isArray(value) ? value : [value]
      const allColors = await fetchColors()
      const selectedColorObjects = allColors.filter(color => selectedValues.includes(color.id))

      setEditValueState(prev => ({
        ...prev,
        colors: selectedColorObjects,
      }))
    },
    [fetchColors]
  )

  const handleSaveLabel = useCallback(
    async (editData: Partial<CreateWineTasteParams>) => {
      if (!data.id) return

      await updateTasteMutation.mutateAsync({
        tasteId: data.id,
        newTaste: {
          label: editData.label || '',
          labelEn: editData.labelEn || '',
          value: editData.value || '',
          colors: editData.colors || [],
        },
      })

      setIsEditing(false)
    },
    [data.id, updateTasteMutation]
  )

  const setEditValue = useCallback((field: string, value: string | BaseWineColor[]) => {
    setEditValueState(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValueState({
      label: data.label,
      labelEn: data.labelEn || '',
      value: data.value,
      colors: data.colors || [],
    })
  }, [data.label, data.labelEn, data.value, isEditable])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValueState({
      label: data.label,
      labelEn: data.labelEn || '',
      value: data.value,
      colors: data.colors || [],
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

  const selectedColors = editValue.colors || []
  const colorValues = selectedColors.map(color => color.id)

  return {
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    isSaving: updateTasteMutation.isPending,
    selectedColors,
    colorValues,
    handleColorChange,

    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    setEditValue,
  }
}
