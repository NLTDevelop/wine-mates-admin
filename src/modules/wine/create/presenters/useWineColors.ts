
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { wineColorQueries } from '../entities/color/wine-color-queries'
import { WineColorCategory, WineCategoryFormData, WineColorTones, CreateCategoryParams, CreateColorParams } from '../entities/types/color'
import { mockWineColorCategories } from '../entities/color/mock'


interface CategoryFormsData {
  [categoryId: string]: WineCategoryFormData
}

export const useWineColors = () => {

  const [categoryFormsData, setCategoryFormsData] = useState<CategoryFormsData>({})
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = mockWineColorCategories
  const isLoading = false

  const { data: categoryColors = [] } = useQuery(selectedCategory ? wineColorQueries.colors.list(selectedCategory) : { queryKey: ['skip'], queryFn: () => [] })

  const createCategoryMutation = useMutation(wineColorQueries.categories.create())
  const deleteCategoryMutation = useMutation(wineColorQueries.categories.delete())
  const createColorMutation = useMutation(wineColorQueries.colors.create())

  const getCategoryFormData = (categoryId: string): WineCategoryFormData => {
    return (
      categoryFormsData[categoryId] || {
        value: '',
        label: '',
        labelEn: '',
        tones: { pale: '', medium: '', deep: '' },
      }
    )
  }


  const updateCategoryFormData = (categoryId: string, updates: Partial<WineCategoryFormData>) => {
    setCategoryFormsData(prev => ({
      ...prev,
      [categoryId]: {
        ...getCategoryFormData(categoryId),
        ...updates,
      },
    }))
  }

  const resetCategoryFormData = (categoryId: string) => {
    setCategoryFormsData(prev => ({
      ...prev,
      [categoryId]: {
        value: '',
        label: '',
        labelEn: '',
        tones: { pale: '', medium: '', deep: '' },
      },
    }))
  }

  const addCategory = (categoryData: WineCategoryFormData) => {
    console.log('categoryData->', categoryData)
    const params: CreateCategoryParams = {
      value: categoryData.value,
      label: categoryData.label,
      labelEn: categoryData.labelEn,
      tones: categoryData.tones,
    }

    createCategoryMutation.mutate(params, {
      onSuccess: () => {
        // Не нужно сбрасывать, так как у нас теперь отдельные формы
      },
    })
  }

  const deleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId, {
      onSuccess: () => {
        if (selectedCategory === categoryId) {
          setSelectedCategory('')
        }
        // Удаляем данные формы для удаленной категории
        setCategoryFormsData(prev => {
          const newData = { ...prev }
          delete newData[categoryId]
          return newData
        })
      },
    })
  }

  const addColorToCategory = (categoryId: string, colorData: { colorName: string; tones: WineColorTones }) => {
    console.log('colorData->', colorData)
    const params: CreateColorParams = {
      categoryId: categoryId,
      data: {
        category: categoryId,
        colorName: colorData.colorName,
        tones: colorData.tones,
      },
    }

    createColorMutation.mutate(params, {
      onSuccess: () => {
        // Сбрасываем форму только для этой категории
        resetCategoryFormData(categoryId)
      },
    })
  }

  const updateTone = (categoryId: string, tone: keyof WineColorTones, value: string) => {
    updateCategoryFormData(categoryId, {
      tones: {
        ...getCategoryFormData(categoryId).tones!,
        [tone]: value.replace('#', ''),
      },
    })
  }

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Сбрасываем форму только для выбранной категории
    resetCategoryFormData(categoryId)
  }

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId)
  }

  const handleAddColor = (categoryId: string) => {
    const formData = getCategoryFormData(categoryId)
    if (canAddColor(categoryId) && formData.tones) {
      addColorToCategory(categoryId, {
        colorName: formData.label, // Используем label как colorName
        tones: formData.tones,
      })
    }
  }

  // canAddColor теперь для конкретной категории
  const canAddColor = (categoryId: string) => {
    const formData = getCategoryFormData(categoryId)
    return formData.label && formData.tones?.pale && formData.tones?.medium && formData.tones?.deep
  }

  const baseHex = useMemo(() => {
    if (!selectedCategory) return ''

    const category = categories.find((cat: WineColorCategory) => cat.id === selectedCategory)

    if (category?.value && category.value.startsWith('#')) {
      return category.value.replace('#', '')
    }

    if (category?.tones?.pale) {
      return category.tones.pale.split(',')[0]?.trim() || ''
    }

    return selectedCategory
  }, [selectedCategory, categories])

  const isLoadingState = isLoading || createCategoryMutation.isPending || createColorMutation.isPending || deleteCategoryMutation.isPending

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  return {
    categories,
    categoryColors,
    // Возвращаем функции для работы с формами категорий
    getCategoryFormData,
    updateCategoryFormData,
    resetCategoryFormData,
    updateTone,
    selectedCategory,
    isLoading: isLoadingState,
    canAddColor, // Теперь это функция
    addCategory,
    addColorToCategory,
    selectCategory,
    handleDeleteCategory,
    handleAddColor, // Теперь принимает categoryId
    baseHex,
    selectedCategoryData,
  }
}
