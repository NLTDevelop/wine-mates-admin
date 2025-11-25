import { useCallback, useState } from 'react'
import { useWineTaste } from './useWineTaste'
import { arraysEqual, getDisplayNames } from '@/lib/utils'
import { CreateWineTasteParams, CreateWineTasteRequest, UpdateWineTasteParams, WineTaste } from '../entities/types/tastes'
import { BaseWineColor } from '../../general/entities/types'

export const useTastePalette = (cachedColors?: BaseWineColor[]) => {
  const { tastes, isLoading, isCreating, isUpdating, isDeleting, createTaste, updateTaste, deleteTaste, totalCount, filters, onChangePagination } = useWineTaste(cachedColors)

  const [isFormOpen, setIsFormOpen] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, CreateWineTasteParams>>({})

  const isLoadingState = isLoading || isCreating || isUpdating || isDeleting

  const hasChanges = useCallback(
    (wineTasteId: string): boolean => {
      const originalWineTaste = tastes.find((wt: WineTaste) => wt?.id === wineTasteId)
      const currentFormData = formData[wineTasteId]

      if (!originalWineTaste || !currentFormData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentFormData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNames(originalWineTaste.translations)

      const nameChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn

      const originalColorIds = originalWineTaste.colors?.map((c: BaseWineColor) => c?.id) || []
      const currentColorIds = currentFormData.colors?.map(c => c?.id) || []
      const colorsChanged = JSON.stringify(originalColorIds.sort()) !== JSON.stringify(currentColorIds.sort())
      const translationsChanged = !arraysEqual(originalWineTaste.translations, currentFormData.translations)

      return nameChanged || colorsChanged || translationsChanged
    },
    [tastes, formData]
  )

  const handleAddTaste = useCallback(
    (tasteData: CreateWineTasteRequest) => {
      return createTaste(tasteData)
    },
    [createTaste]
  )

  const handleToggleForm = useCallback(
    (tasteId: string) => {
      setIsFormOpen(prev => ({
        ...prev,
        [tasteId]: !prev[tasteId],
      }))
      if (!formData[tasteId]) {
        const taste = tastes.find(t => t.id === tasteId)
        if (taste) {
          setFormData(prev => ({
            ...prev,
            [tasteId]: {
              translations: taste.translations || [],
              colorHex: taste.colorHex || '',
              colors: taste.colors || [],
            },
          }))
        }
      }
    },
    [formData, tastes]
  )

  const updateFormData = useCallback((tasteId: string, field: keyof CreateWineTasteParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [tasteId]: {
        ...prev[tasteId],
        [field]: value,
      },
    }))
  }, [])

  const handleSaveTaste = useCallback(
    async (tasteId: string) => {
      const data = formData[tasteId]
      if (data) {
        const updateData: CreateWineTasteRequest = {
          translations: data.translations || [],
          colorHex: data.colorHex,
          colorIds: data.colors.map(color => color.id),
        }

        const updateParams: UpdateWineTasteParams = {
          tasteId,
          newTaste: updateData,
        }
        setIsFormOpen(prev => ({
          ...prev,
          [tasteId]: false,
        }))

        setFormData(prev => {
          const newData = { ...prev }
          delete newData[tasteId]
          return newData
        })
        await updateTaste(updateParams)
      }
    },
    [formData, updateTaste]
  )

  const handleCancelEdit = useCallback((tasteId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [tasteId]: false,
    }))
    setFormData(prev => {
      const newData = { ...prev }
      delete newData[tasteId]
      return newData
    })
  }, [])

  const handleDeleteTaste = useCallback(
    (tasteId: string) => {
      deleteTaste(tasteId)
    },
    [deleteTaste]
  )

  return {
    tastes,
    totalCount,
    filters,

    loadings: {
      isLoading: isLoadingState,
      isLoadingData: isLoading,
      isCreating,
      isUpdating,
      isDeleting,
    },

    isFormOpen,
    formData,

    handleAddTaste,

    handleToggleForm,
    updateFormData,
    handleSaveTaste,
    handleCancelEdit,
    handleDeleteTaste,
    onChangePagination,
    hasChanges,
  }
}
