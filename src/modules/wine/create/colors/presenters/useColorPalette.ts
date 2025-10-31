import { useMemo, useState } from 'react'
import { useColor } from './useColor'
import { WineColor, WineColorItem } from '../entities/types/color'
import { sortColorsByBrightness } from '@/lib/utils'
import { mockColors } from '../entities/mock'

export const useColorPalette = () => {
  const colors = mockColors
  const { /*colors,*/ isLoading, createColor, updateColor, deleteColor, createShade } = useColor()

  const [isAccordionOpen, setIsAccordionOpen] = useState<{ [colorId: string]: boolean }>({})
  const [editingColor, setEditingColor] = useState<{ colorId: string; color?: WineColor } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<{ [colorId: string]: boolean }>({})
  const [newColorData, setNewColorData] = useState<{
    [colorId: string]: {
      label: string
      labelEn: string
      value: string
      tones?: {
        pale: string
        medium: string
        deep: string
      }
    }
  }>({})

  const handleAddCategory = (categoryData: { value: string; label: string; labelEn: string }) => {
    createColor(categoryData)
  }

  const handleDeleteCategory = (colorId: string) => {
    deleteColor(colorId)
  }

  const handleAddColor = (colorId: string) => {
    const colorData = newColorData[colorId]
    if (colorData) {
      const wineColorItem: WineColorItem = {
        name: colorData.label,
        nameEn: colorData.labelEn,
        tones: colorData.tones || {
          pale: colorData.value,
          medium: colorData.value,
          deep: colorData.value,
        },
      }

      createShade(colorId, {
        label: colorData.label,
        labelEn: colorData.labelEn,
        value: colorData.value,
        items: [wineColorItem],
      })

      setNewColorData(prev => ({
        ...prev,
        [colorId]: {
          label: '',
          labelEn: '',
          value: '',
          tones: undefined,
        },
      }))
    }
  }

  const handleToggleForm = (colorId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [colorId]: !prev[colorId],
    }))
  }

  const handleEditColor = (colorId: string, color: WineColor) => {
    setEditingColor({ colorId, color })
    setIsFormOpen(prev => ({ ...prev, [colorId]: true }))

    const firstItem = color.items?.[0]
    setNewColorData(prev => ({
      ...prev,
      [colorId]: {
        label: color.label,
        labelEn: color.labelEn || '',
        value: color.value,
        tones: firstItem?.tones,
      },
    }))
  }

  const handleCancelEdit = (colorId: string) => {
    setEditingColor(null)
    setNewColorData(prev => ({
      ...prev,
      [colorId]: {
        label: '',
        labelEn: '',
        value: '',
        tones: undefined,
      },
    }))
    setIsFormOpen(prev => ({ ...prev, [colorId]: false }))
  }

  const handleSaveColor = (colorId: string) => {
    if (editingColor && editingColor.color && editingColor.colorId === colorId) {
      updateColor({
        colorId: editingColor.color.id,
        newColor: {
          label: newColorData[colorId].label,
          labelEn: newColorData[colorId].labelEn,
          value: newColorData[colorId].value,
          items: editingColor.color.items?.map((item, index) =>
            index === 0
              ? {
                  ...item,
                  name: newColorData[colorId].label,
                  nameEn: newColorData[colorId].labelEn,
                  tones: newColorData[colorId].tones || item.tones,
                }
              : item
          ),
        },
      })
    } else {
      handleAddColor(colorId)
    }
    handleCancelEdit(colorId)
  }

  const updateFormData = (colorId: string, field: string, value: string) => {
    setNewColorData(prev => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        [field]: value,
      },
    }))
  }

  const updateToneData = (colorId: string, tone: 'pale' | 'medium' | 'deep', value: string) => {
    setNewColorData(prev => {
      const currentData = prev[colorId] || { label: '', labelEn: '', value: '' }

      return {
        ...prev,
        [colorId]: {
          ...currentData,
          tones: {
            pale: currentData.tones?.pale || currentData.value,
            medium: currentData.tones?.medium || currentData.value,
            deep: currentData.tones?.deep || currentData.value,
            [tone]: value,
          },
        },
      }
    })
  }

  const handleToggleAccordion = (colorId: string, isOpen: boolean) => {
    setIsAccordionOpen(prev => ({
      ...prev,
      [colorId]: isOpen,
    }))
    if (!isOpen && isFormOpen[colorId]) {
      handleCancelEdit(colorId)
    }
  }

  const canAddColor = (colorId: string) => {
    const data = newColorData[colorId]
    return !!(data?.label && data.labelEn && data.tones?.deep && data.tones?.medium && data.tones?.pale)
  }

  const sortedItems = useMemo(() => {
    return sortColorsByBrightness(colors)
  }, [colors])

  return {
    colors: sortedItems,
    isLoading,

    editingColor,
    isFormOpen,
    isAccordionOpen,
    newColorData,

    handleAddCategory,
    handleDeleteCategory,
    handleToggleForm,
    handleEditColor,
    handleCancelEdit,
    handleSaveColor,
    updateFormData,
    updateToneData,
    canAddColor,
    handleToggleAccordion,
  }
}
