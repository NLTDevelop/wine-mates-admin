import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { PaletteItemData } from '../ui'
import { wineColorQueries } from '../entities/color/wine-color-queries'
import { WineColor } from '../entities/types/color'

interface UsePaletteItemProps {
  data: PaletteItemData
  isNeedCopy?: boolean
  onItemClick?: (data: PaletteItemData) => void
  handleClick?: () => void
  variant?: 'category' | 'color'
  isEditable?: boolean
  categoryId?: string
}

interface UsePaletteItemReturn {
  copied: boolean
  isEditing: boolean
  editValue: string
  color: string
  cardTextColorClass: string
  cardMutedTextColorClass: string
  isSaving: boolean

  startEditing: () => void
  cancelEditing: () => void
  handleSaveLabel: () => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleCopy: () => void
  handleMainClick: () => void
  setEditValue: (value: string) => void
  getItemName: (item: string | any) => string
  getItemTones: (item: string | any) => any
  getRenderableItems: () => any[]

  updateCategoryMutation: any
}

export const usePaletteItem = ({ data, isNeedCopy = false, variant = 'color', categoryId }: UsePaletteItemProps): UsePaletteItemReturn => {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.label)
  const queryClient = useQueryClient()

  const color = data.value[0] === '#' ? data.value : '#ffffff'
  const { textColorClass: cardTextColorClass, mutedTextColorClass: cardMutedTextColorClass } = useContrastText(color)

  const updateCategoryMutation = useMutation(wineColorQueries.categories.update())
  const updateColorMutation = useMutation(wineColorQueries.colors.update())

  const handleSaveLabel = useCallback(async () => {
    if (!isWineColor(data) || !data.id) return

    if (variant === 'category') {
      await updateCategoryMutation.mutateAsync({
        categoryId: data.id,
        data: {
          value: data.value,
          label: editValue,
          labelEn: data.labelEn || editValue,
          tones: data.tones,
        },
      })
      queryClient.invalidateQueries({ queryKey: ['wine-color-categories', 'list'] })
    } else if (variant === 'color' && categoryId) {
      await updateColorMutation.mutateAsync({
        categoryId: categoryId,
        colorId: data.id,
        data: {
          colorName: editValue,
        },
      })
      queryClient.invalidateQueries({ queryKey: ['wine-color-categories', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['wine-colors', 'list', categoryId] })
    }

    setIsEditing(false)
  }, [data, editValue, variant, categoryId, updateCategoryMutation, updateColorMutation, queryClient])

  const startEditing = useCallback(() => {
    console.log('Starting editing for:', data?.id, data.label)
    setIsEditing(true)
    setEditValue(data.label)
  }, [data?.id, data.label])

  const cancelEditing = useCallback(() => {
    console.log('Canceling editing for:', data?.id)
    setIsEditing(false)
    setEditValue(data.label)
  }, [data.label])

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

  const handleCopy = useCallback(async () => {
    if (!isNeedCopy) return
    try {
      await navigator.clipboard.writeText(data.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy error-> ', err)
    }
  }, [isNeedCopy, data.value])

  const handleMainClick = useCallback(() => {
    if (isEditing) return

    if (isNeedCopy && variant === 'color') {
      handleCopy()
    }
  }, [isEditing, isNeedCopy, variant, handleCopy])

  const getItemName = useCallback((item: string | any): string => {
    return typeof item === 'string' ? item : item?.name || ''
  }, [])

  const getItemTones = useCallback((item: string | any) => {
    return typeof item === 'string' ? undefined : item?.tones
  }, [])

  const getRenderableItems = useCallback((): any[] => {
    if (!isWineColor(data)) return []

    if (variant === 'category' && data.colors) {
      return data.colors.flatMap(color => color.items || [])
    }

    if (variant === 'color' || !variant) {
      return data.items || []
    }

    return []
  }, [data, variant])

  const isWineColor = (item: PaletteItemData): item is WineColor => {
    return (item as WineColor).id !== undefined
  }

  return {
    copied,
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    cardMutedTextColorClass,
    isSaving: updateCategoryMutation.isPending,

    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    handleCopy,
    handleMainClick,
    getItemName,
    getItemTones,
    getRenderableItems,
    setEditValue,

    updateCategoryMutation,
  }
}
