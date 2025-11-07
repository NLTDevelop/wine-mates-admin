import { useMemo, useState } from 'react'
import { useColor } from './useColor'
import { ReorderShadesParams, UpdateWineItemParams, WineColorItem } from '../entities/types/color'
import { sortColorsByBrightness } from '@/lib/utils'
import { mockColors } from '../entities/mock'
import { useColorStore } from '../entities/color-store'

export const useColorPalette = () => {
  const store = useColorStore()
  const colors = mockColors
  const { /*colors,*/ isLoading, createColor, updateShade, deleteColor, createShade, reorderShades, isReorderingShades } = useColor()

  const [isAccordionOpen, setIsAccordionOpen] = useState<{ [colorId: string]: boolean }>({})
  const [editingColor, setEditingColor] = useState<{ colorId: string; item?: WineColorItem } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<{ [colorId: string]: boolean }>({})
  const [newColorData, setNewColorData] = useState<{
    [colorId: string]: {
      name: string
      nameEn: string
      shade: string
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
    const itemData = newColorData[colorId]
    if (itemData) {
      const wineColorItem: WineColorItem = {
        id: `${colorId}-${Date.now()}`,
        name: itemData.name,
        nameEn: itemData.nameEn,
        shade: itemData.shade,
        tones: itemData.tones || {
          pale: itemData.shade,
          medium: itemData.shade,
          deep: itemData.shade,
        },
        order: '1',
      }

      createShade(colorId, wineColorItem)

      setNewColorData(prev => ({
        ...prev,
        [colorId]: {
          name: '',
          nameEn: '',
          shade: '',
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

  const handleEditColor = (colorId: string, item: WineColorItem) => {
    setEditingColor({ colorId, item })
    setIsFormOpen(prev => ({ ...prev, [colorId]: true }))

    setNewColorData(prev => ({
      ...prev,
      [colorId]: {
        name: item.name,
        nameEn: item.nameEn,
        shade: item.shade,
        tones: item.tones,
      },
    }))
  }

  const handleCancelEdit = (colorId: string) => {
    setEditingColor(null)
    setNewColorData(prev => ({
      ...prev,
      [colorId]: {
        name: '',
        nameEn: '',
        shade: '',
        tones: undefined,
      },
    }))
    setIsFormOpen(prev => ({ ...prev, [colorId]: false }))
  }

  const handleSaveColor = (colorId: string) => {
    if (editingColor && editingColor.item && editingColor.colorId === colorId) {
      const itemData = newColorData[colorId]
      if (itemData) {
        const updateParams: UpdateWineItemParams = {
          itemId: editingColor.item.id,
          name: itemData.name,
          nameEn: itemData.nameEn,
          shade: itemData.shade,
          tones: itemData.tones || editingColor.item.tones,
          order: editingColor.item.order,
        }
        updateShade(colorId, updateParams)
      }
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
            pale: currentData.tones?.pale || '',
            medium: currentData.tones?.medium || '',
            deep: currentData.tones?.deep || '',
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
    return !!(data?.name && data.nameEn && data.tones?.deep && data.tones?.medium && data.tones?.pale)
  }

  const sortedItems = useMemo(() => {
    return sortColorsByBrightness(colors)
  }, [colors])

  const handleReorderShades = (colorId: string, shades: WineColorItem[]) => {
    store.reorderShades(colorId, shades)
    const reorderParams: ReorderShadesParams = {
      colorId,
      shades: shades.map((shade, index) => ({
        id: shade.id,
        order: index,
      })),
    }

    reorderShades(reorderParams)
  }

  return {
    colors: sortedItems,
    isLoading: isLoading || isReorderingShades,

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
    handleReorderShades,
  }
}
