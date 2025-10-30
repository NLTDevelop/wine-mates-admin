import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { colorQueries } from '../entities/color-queries'
import { WineColor } from '../entities/types/color'

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
  editValue: string
  color: string
  cardTextColorClass: string
  isSaving: boolean
  renderableItems: WineColor[]

  startEditing: () => void
handleSaveLabel: (e?: MouseEvent | KeyboardEvent) => Promise<void>
  cancelEditing: (e?: MouseEvent | KeyboardEvent) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleMainClick: () => void
  handleAddShadeClick: () => void
  setEditValue: (value: string) => void
  getItemName: (item: WineColor) => string
  getItemTones: (item: WineColor) => any
}

export const usePaletteItem = ({ data, onItemClick, handleClick, isEditable = false, isFormOpen = false, onCancel, onToggleForm }: UsePaletteItemProps): UsePaletteItemReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.label)
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
    async (e?: MouseEvent | KeyboardEvent) => {
     if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      if (!data.id) return

      await updateColorMutation.mutateAsync({
        colorId: data.id,
        newColor: {
          label: editValue,
          labelEn: data.labelEn || editValue,
          value: data.value,
          items: data.items,
        },
      })

      setIsEditing(false)
    },
    [data, editValue, updateColorMutation]
  )

  const startEditing = useCallback(() => {
    if (!isEditable) return
    setIsEditing(true)
    setEditValue(data.label)
  }, [data.label, isEditable])

  const cancelEditing = useCallback(
    (e?: MouseEvent | KeyboardEvent) => {
       if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      setIsEditing(false)
      setEditValue(data.label)
    },
    [data.label]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveLabel(e)
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

  const getItemName = useCallback((item: WineColor): string => {
    return item.label || ''
  }, [])

  const getItemTones = useCallback((item: WineColor) => {
    if (item.items && item.items.length > 0) {
      return item.items[0].tones
    }
    return undefined
  }, [])

  const getRenderableItems = useCallback((): WineColor[] => {
    if (data.items && data.items.length > 0) {
      return data.items.map((item, index) => ({
        id: `${data.id}-item-${index}`,
        label: item.name,
        labelEn: item.nameEn,
        value: item.tones?.medium || data.value,
        items: [item],
      }))
    }
    return []
  }, [data])

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
