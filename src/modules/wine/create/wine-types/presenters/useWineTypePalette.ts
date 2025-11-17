import { useState, useCallback } from 'react'
import { useWineTypes } from './useWineTypes'
import { CreateWineTypeParams, CreateWineTypeRequest, UpdateWineTypeParams, WineType } from '../entities/types/wine-type'
import { BaseWineColor } from '../../general/entities/types'

export const useWineTypePalette = (cachedColors: BaseWineColor[]) => {
  const { wineTypes, isLoading, isCreating, isUpdating, isDeleting, createWineType, updateWineType, deleteWineType} = useWineTypes(cachedColors)

  const [isFormOpen, setIsFormOpen] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, CreateWineTypeParams>>({})

  const hasChanges = useCallback(
    (wineTypeId: string): boolean => {
      const originalWineType = wineTypes.find((wt:WineType) => wt.id === wineTypeId)
      const currentFormData = formData[wineTypeId]

      if (!originalWineType || !currentFormData) return false

      const nameChanged = originalWineType.nameUa !== currentFormData.nameUa || originalWineType.nameEn !== currentFormData.nameEn

      const originalColorIds = originalWineType.colors?.map((c:BaseWineColor) => c.id) || []
      const currentColorIds = currentFormData.colors?.map(c => c.id) || []
      const colorsChanged = JSON.stringify(originalColorIds.sort()) !== JSON.stringify(currentColorIds.sort())

      return nameChanged || colorsChanged
    },
    [wineTypes, formData]
  )

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
        const wineType = wineTypes.find((wt:WineType) => wt.id === wineTypeId)
        if (wineType) {
          setFormData(prev => ({
            ...prev,
            [wineTypeId]: {
              nameUa: wineType.nameUa || '',
              nameEn: wineType.nameEn || '',
              colors: wineType.colors || [],
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
          nameUa: data.nameUa,
          nameEn: data.nameEn,
          colorIds: data.colors.map(color => color.id),
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

  const isLoadingState = isLoading || isCreating || isUpdating || isDeleting

  return {
    wineTypes,
    isLoading: isLoadingState,
    isCreating,
    isUpdating,
    isDeleting,
    isFormOpen,
    formData,
    hasChanges,
    handleAddWineType,
    handleToggleForm,
    updateFormData,
    handleSaveWineType,
    handleCancelEdit,
    handleDeleteWineType,
  }
}
