import { useState, useCallback } from 'react'
import { useWineTypes } from './useWineTypes'
import { CreateWineTypeParams, CreateWineTypeRequest, UpdateWineTypeParams, WineType } from '../entities/types/wine-type'
import { arraysEqual, getDisplayNames } from '@/lib/utils'

export const useWineTypePalette = () => {
  const { wineTypes, isLoading, isCreating, isUpdating, isDeleting, createWineType, updateWineType, deleteWineType, isReorderingGroup, reorderGroup } = useWineTypes()

  const [isFormOpen, setIsFormOpen] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, CreateWineTypeParams>>({})

  const hasChanges = useCallback(
    (wineTypeId: string): boolean => {
      const originalWineType = wineTypes.find((wt: WineType) => wt?.id === wineTypeId)
      const currentFormData = formData[wineTypeId]

      if (!originalWineType || !currentFormData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentFormData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNames(originalWineType.translations)

      const nameChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn

      const translationsChanged = !arraysEqual(originalWineType.translations, currentFormData.translations)
      const checkboxChanged = currentFormData.isSparkling !== originalWineType.isSparkling

      return nameChanged || translationsChanged || checkboxChanged
    },
    [wineTypes, formData]
  )

  const isLoadingState = isLoading || isCreating || isUpdating || isDeleting

  const handleAddWineType = useCallback(
    async (wineTypeData: CreateWineTypeRequest) => {
      return await createWineType(wineTypeData)
    },
    [createWineType]
  )

  const handleToggleForm = useCallback(
    (wineTypeId: string) => {
      setIsFormOpen(prev => ({
        ...prev,
        [wineTypeId]: !prev[wineTypeId],
      }))
      if (!formData[wineTypeId]) {
        const wineType = wineTypes.find((wt: WineType) => wt?.id === wineTypeId)
        if (wineType) {
          setFormData(prev => ({
            ...prev,
            [wineTypeId]: {
              translations: wineType.translations || [],
              isSparkling: wineType.isSparkling || false,
            },
          }))
        }
      }
    },
    [formData, wineTypes]
  )

  const updateFormData = useCallback((wineTypeId: string, field: keyof CreateWineTypeParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [wineTypeId]: {
        ...prev[wineTypeId],
        [field]: value,
      },
    }))
  }, [])

  const handleSaveWineType = useCallback(
    async (wineTypeId: string) => {
      const data = formData[wineTypeId]
      if (!data) return

      if (!hasChanges(wineTypeId)) {
        setIsFormOpen(prev => ({
          ...prev,
          [wineTypeId]: false,
        }))
        return
      }

      try {
        const updateData: CreateWineTypeRequest = {
          translations: data.translations || [],
          isSparkling: data.isSparkling || false,
        }
        const updateParams: UpdateWineTypeParams = {
          wineTypeId,
          newWineType: updateData,
        }
        await updateWineType(updateParams)
        setIsFormOpen(prev => ({
          ...prev,
          [wineTypeId]: false,
        }))
      } catch (error) {
        console.error('Failed to update wine type:', error)
      }
    },
    [formData, updateWineType, hasChanges]
  )

  const handleCancelEdit = useCallback((wineTypeId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [wineTypeId]: false,
    }))
    setFormData(prev => {
      const newData = { ...prev }
      delete newData[wineTypeId]
      return newData
    })
  }, [])

  const handleDeleteWineType = useCallback(
    (wineTypeId: string) => {
      deleteWineType(wineTypeId)
    },
    [deleteWineType]
  )

  return {
    wineTypes,
    isLoading: isLoadingState,
    isCreating,
    isUpdating,
    isDeleting,
    isReorderingGroup,
    isFormOpen,
    formData,
    hasChanges,
    handleAddWineType,
    handleToggleForm,
    updateFormData,
    handleSaveWineType,
    handleCancelEdit,
    handleDeleteWineType,
    reorderGroup,
  }
}
