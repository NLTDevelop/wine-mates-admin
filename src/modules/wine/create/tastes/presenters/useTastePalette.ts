import { useCallback, useState } from 'react'
import { useWineTaste } from './useWineTaste'
import { CreateWineTasteParams, CreateWineTasteRequest, UpdateWineTasteParams } from '../entities/types/tastes'
import { BaseWineColor } from '../../general/entities/types'

export const useTastePalette = (cachedColors?: BaseWineColor[]) => {
  const { tastes, isLoading, isCreating, isUpdating, isDeleting, createTaste, updateTaste, deleteTaste, totalCount, filters, onChangePagination } = useWineTaste(cachedColors)

  const [isFormOpen, setIsFormOpen] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, CreateWineTasteParams>>({})

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
              nameUa: taste.nameUa || '',
              nameEn: taste.nameEn || '',
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
          nameUa: data.nameUa,
          nameEn: data.nameEn,
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

  const isLoadingState = isLoading || isCreating || isUpdating || isDeleting

  return {
    tastes,
    totalCount,
    filters,

    isLoading: isLoadingState,
    isCreating,
    isUpdating,
    isDeleting,

    isFormOpen,
    formData,

    handleAddTaste,

    handleToggleForm,
    updateFormData,
    handleSaveTaste,
    handleCancelEdit,
    handleDeleteTaste,
    onChangePagination,
  }
}
