import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'
import { CreateWineAromaGroupParams, WineAromaGroup } from '../entities/types/flavor'

interface UseEditFlavorGroupProps {
  data: WineAromaGroup
  onItemClick?: (data: WineAromaGroup) => void
  handleClick?: () => void
  isEditable?: boolean
  isFormOpen?: boolean
  onCancel?: (id: string) => void
  onToggleForm?: () => void
}

interface UseEditFlavorGroupReturn {
  isEditing: boolean
  editValue: {
    label: string
    labelEn: string
    value: string
  }
  color: string
  cardTextColorClass: string
  isSaving: boolean
  renderableItems: any[]

  startEditing: () => void
  handleSaveLabel: (editData: Partial<CreateWineAromaGroupParams>) => Promise<void>
  cancelEditing: (e?: MouseEvent | KeyboardEvent) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleMainClick: () => void
  handleAddAromaClick: () => void
  setEditValue: (field: string, value: string) => void
  getItemName: (item: any) => string
  getItemsColor: (item: any) => string
}

export const useEditFlavorGroup = ({ data, onItemClick, handleClick, isEditable = false, isFormOpen = false, onCancel, onToggleForm }: UseEditFlavorGroupProps): UseEditFlavorGroupReturn => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValueState] = useState({
    label: data.label,
    labelEn: data.labelEn || '',
    value: data.value,
  })

  const queryClient = useQueryClient()

  const color = data.value?.[0] === '#' ? data.value : '#ffffff'
  const { textColorClass: cardTextColorClass } = useContrastText(color)

  const updateGroupMutation = useMutation({
    ...wineFlavorQueries.updateGroup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', 'list'] })
    },
  })

  const handleSaveLabel = useCallback(
    async (editData: Partial<CreateWineAromaGroupParams>) => {
      if (!data.id) return

      await updateGroupMutation.mutateAsync({
        groupId: data.id,
        newGroup: {
          label: editData.label || '',
          labelEn: editData.labelEn || '',
          value: editData.value || '',
          items: data.items,
          colors: data.colors,
        },
      })

      setIsEditing(false)
    },
    [data, updateGroupMutation]
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
  }, [data.label, data.labelEn, data.value, isEditable])

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
    [data.label, data.labelEn, data.value]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveLabel(editValue)
      } else if (e.key === 'Escape') {
        cancelEditing(e)
      }
    },
    [handleSaveLabel, cancelEditing, editValue]
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

  const handleAddAromaClick = useCallback(() => {
    if (isFormOpen && onCancel) {
      onCancel(data.id)
    } else if (onToggleForm) {
      onToggleForm()
    }
  }, [isFormOpen, onCancel, data.id, onToggleForm])

  const getItemName = useCallback((item: any): string => {
    return item.name || item.label || ''
  }, [])

  const getItemsColor = useCallback((item: any): string => {
    return item.value || ''
  }, [])

  const getRenderableItems = useCallback((): WineAromaGroup[] => {
    if (data.items && data.items.length > 0) {
      return data.items.map((item, index) => ({
        id: item.id || `${data.id}-item-${index}`,
        label: item.name,
        labelEn: item.nameEn,
        value: data.value,
        items: [item],
        colors: data.colors,
      }))
    }
    return []
  }, [data])

  const renderableItems: WineAromaGroup[] = getRenderableItems()

  return {
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    isSaving: updateGroupMutation.isPending,
    renderableItems,

    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    handleMainClick,
    handleAddAromaClick,
    getItemName,
    setEditValue,
    getItemsColor,
  }
}
