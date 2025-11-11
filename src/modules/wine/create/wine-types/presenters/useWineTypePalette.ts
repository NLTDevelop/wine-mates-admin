import {  useState } from 'react'
import { mockWineTypes } from '../entities/mock'
import { useWineTypes } from './useWineTypes'
import { CreateWineTypeParams } from '../entities/types/wine-type'

export const useWineTypePalette = () => {
  const wineTypes = mockWineTypes
  const { /*wineTypes,*/ isLoading, createWineType, deleteWineType } = useWineTypes()

  const [isFormOpen, setIsFormOpen] = useState<{ [tasteId: string]: boolean }>({})

  const handleAddWineType = (wineTypeData: CreateWineTypeParams) => {
    createWineType(wineTypeData)
  }

  const handleDeleteWineType = (tasteId: string) => {
    deleteWineType(tasteId)
  }

  const handleToggleForm = (tasteId: string) => {
    setIsFormOpen(prev => ({
      ...prev,
      [tasteId]: !prev[tasteId],
    }))
  }

  const handleCancelEdit = (tasteId: string) => {
    setIsFormOpen(prev => ({ ...prev, [tasteId]: false }))
  }


  return {
    wineTypes,
    isLoading,
    isFormOpen,

    handleAddWineType,
    handleDeleteWineType,
    handleToggleForm,
    handleCancelEdit,
  }
}
