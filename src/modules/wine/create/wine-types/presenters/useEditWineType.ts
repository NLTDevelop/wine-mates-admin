import { useState, useCallback, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseWineColor } from '../../general/entities/types'
import { CreateWineTypeParams, WineType } from '../entities/types/wine-type'
import { wineTypeQueries } from '../entities/wine-type-queries'
import { CreateWineTasteParams } from '../../tastes/entities/types/tastes'

interface UseEditWineTypeProps {
  data: WineType
  isEditable?: boolean
  isFormOpen?: boolean
  onCancel?: (id: string) => void
  onToggleForm?: () => void
  fetchColors?: () => Promise<BaseWineColor[]>
}

interface UseEditWineTypeReturn {
  isEditing: boolean
  editValue: Partial<CreateWineTypeParams>
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

export const useEditWineType = ({ data, isEditable = false, fetchColors }: UseEditWineTypeProps): UseEditWineTypeReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValueState] = useState<Partial<CreateWineTypeParams>>({
    label: data.label,
    labelEn: data.labelEn || '',
    colors: data.colors || [],
  })

  const queryClient = useQueryClient()

  const updateTasteMutation = useMutation({
    ...wineTypeQueries.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
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
    async (editData: Partial<CreateWineTypeParams>) => {
      if (!data.id) return

      await updateTasteMutation.mutateAsync({
        wineTypeId: data.id,
        newWineType: {
          label: editData.label || '',
          labelEn: editData.labelEn || '',
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
      colors: data.colors || [],
    })
  }, [data.label, data.labelEn, isEditable])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setEditValueState({
      label: data.label,
      labelEn: data.labelEn || '',
      colors: data.colors || [],
    })
  }, [data.label, data.labelEn])

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
