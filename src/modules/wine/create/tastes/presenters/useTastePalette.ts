import { useState } from 'react'
import { useWineTaste } from './useWineTaste'


export const useTastePalette = () => {
  const { isLoading, createTaste, deleteTaste } = useWineTaste()

  const [isFormOpen, setIsFormOpen] = useState<{ [tasteId: string]: boolean }>({})

  const handleAddTaste = (tasteData: { value: string; label: string; labelEn: string }) => {
    createTaste(tasteData)
  }

  const handleDeleteTaste = (tasteId: string) => {
    deleteTaste(tasteId)
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
    isLoading,
    isFormOpen,

    handleAddTaste,
    handleDeleteTaste,
    handleToggleForm,
    handleCancelEdit,
  }
}