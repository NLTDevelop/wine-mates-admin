import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { colorQueries } from '../entities/color-queries'
import { WineColor, WineColorItem } from '../entities/types/color'

interface UsePaletteItemProps {
  data: WineColor
  onItemClick?: (data: WineColor) => void
  handleClick?: () => void
  isEditable?: boolean
  isFormOpen?: boolean
  onCancel?: (id: string) => void
  onToggleForm?: () => void
}

interface UsePaletteItemReturn {
  isEditing: boolean
  editValue: {
    label: string
    labelEn: string
    value: string
  }
  color: string
  cardTextColorClass: string
  isSaving: boolean
  renderableItems: WineColorItem[]

  startEditing: () => void
  handleSaveLabel: () => Promise<void>
  cancelEditing: (e?: MouseEvent | KeyboardEvent) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleMainClick: () => void
  handleAddShadeClick: () => void
  setEditValue: (field: string, value: string) => void
  getItemName: (item: WineColorItem) => string
  getItemTones: (item: WineColorItem) => any
}

export const usePaletteItem = ({ data, onItemClick, handleClick, isEditable = false, isFormOpen = false, onCancel, onToggleForm }: UsePaletteItemProps): UsePaletteItemReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValueState] = useState({
    label: data.label,
    labelEn: data.labelEn || '',
    value: data.value,
  })

  const queryClient = useQueryClient()

  const color = data.value?.[0] === '#' ? data.value : '#ffffff'
  const { textColorClass: cardTextColorClass } = useContrastText(color)

  const updateColorMutation = useMutation({
    ...colorQueries.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors', 'list'] })
    },
  })

  const handleSaveLabel = useCallback(
    async (editData?: { label: string; labelEn: string; value: string }) => {
      if (!data.id) return

      const saveData = editData || editValue

      await updateColorMutation.mutateAsync({
        colorId: data.id,
        newColor: {
          label: saveData.label,
          labelEn: saveData.labelEn,
          value: saveData.value,
          items: data.items,
        },
      })

      setIsEditing(false)
    },
    [data, editValue, updateColorMutation]
  )

  const setEditValue = useCallback((field: string, value: string) => {
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
    })
  }, [data.label, isEditable])

  const cancelEditing = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      setIsEditing(false)
      setEditValueState({
        label: data.label,
        labelEn: data.labelEn || '',
        value: data.value,
      })
    },
    [data.label]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveLabel()
      } else if (e.key === 'Escape') {
        cancelEditing(e)
      }
    },
    [handleSaveLabel, cancelEditing]
  )

  const handleMainClick = useCallback(() => {
    if (isEditing) return

    if (onItemClick) {
      onItemClick(data)
    }

    if (handleClick) {
      handleClick()
    }
  }, [isEditing, onItemClick, handleClick, data])

  const handleAddShadeClick = useCallback(() => {
    if (isFormOpen && onCancel) {
      onCancel(data.id)
    } else if (onToggleForm) {
      onToggleForm()
    }
  }, [isFormOpen, onCancel, data.id, onToggleForm])

  const getItemName = useCallback((item: WineColorItem): string => {
    return item.name || ''
  }, [])

  const getItemTones = useCallback((item: WineColorItem) => {
    return item.tones
  }, [])

  const getRenderableItems = useCallback((): WineColorItem[] => {
    return data.items || []
  }, [data.items])

  const renderableItems = getRenderableItems()

  return {
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    isSaving: updateColorMutation.isPending,
    renderableItems,

    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    handleMainClick,
    handleAddShadeClick,
    getItemName,
    getItemTones,
    setEditValue,
  }
}
