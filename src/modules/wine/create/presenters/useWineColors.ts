import { useMutation, useQuery} from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { wineColorQueries } from '../entities/color/wine-color-queries'
import { WineColorCategory, WineCategoryFormData, WineColorTones, CreateCategoryParams, CreateColorParams } from '../entities/types/color'
import { mockWineColorCategories } from '../entities/color/mock'

export const useWineColors = () => {
  // const queryClient = useQueryClient()
  const [categoryFormData, setCategoryFormData] = useState<WineCategoryFormData>({
    value: '',
    label: '',
    labelEn: '',
    tones: { pale: '', medium: '', deep: '' },
  })
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = mockWineColorCategories
  const isLoading = false
  // const { data: categories = [], isLoading } = useQuery(
  //   wineColorQueries.categories.list()
  // )

  const { data: categoryColors = [] } = useQuery(selectedCategory ? wineColorQueries.colors.list(selectedCategory) : { queryKey: ['skip'], queryFn: () => [] })

  const createCategoryMutation = useMutation(wineColorQueries.categories.create())

  const deleteCategoryMutation = useMutation(wineColorQueries.categories.delete())

  const createColorMutation = useMutation(wineColorQueries.colors.create())

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
        setCategoryFormData({
          value: '',
          label: '',
          labelEn: '',
          tones: { pale: '', medium: '', deep: '' },
        })
      },
    })
  }

  const deleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId, {
      onSuccess: () => {
        if (selectedCategory === categoryId) {
          setSelectedCategory('')
        }
      },
    })
  }

  const addColorToCategory = (colorData: { category: string; colorName: string; tones: WineColorTones }) => {
    console.log('colorData->', colorData)
    const params: CreateColorParams = {
      categoryId: colorData.category,
      data: {
        category: colorData.category,
        colorName: colorData.colorName,
        tones: colorData.tones,
      },
    }

    createColorMutation.mutate(params, {
      onSuccess: () => {
        setCategoryFormData(prev => ({
          ...prev,
          value: '',
          tones: { pale: '', medium: '', deep: '' },
        }))
      },
    })
  }

  const updateCategoryFormData = (updates: Partial<WineCategoryFormData>) => {
    setCategoryFormData(prev => ({ ...prev, ...updates }))
  }

  const updateTone = (tone: keyof WineColorTones, value: string) => {
    setCategoryFormData(prev => ({
      ...prev,
      tones: {
        ...prev.tones!,
        [tone]: value.replace('#', ''),
      },
    }))
  }

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCategoryFormData(prev => ({
      ...prev,
      value: '',
      tones: { pale: '', medium: '', deep: '' },
    }))
  }

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId)
  }

  const handleAddColor = () => {
    if (canAddColor && selectedCategory && categoryFormData.tones) {
      addColorToCategory({
        category: selectedCategory,
        colorName: categoryFormData.value,
        tones: categoryFormData.tones,
      })
    }
  }

  const canAddColor = categoryFormData.value && categoryFormData.tones?.pale && categoryFormData.tones?.medium && categoryFormData.tones?.deep

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
    categoryFormData,
    selectedCategory,
    isLoading: isLoadingState,
    canAddColor,
    addCategory,
    addColorToCategory,
    updateCategoryFormData,
    updateTone,
    selectCategory,
    handleDeleteCategory,
    handleAddColor,
    baseHex,
    selectedCategoryData,
  }
}
