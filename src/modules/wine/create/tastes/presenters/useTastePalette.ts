import { useMemo, useState } from 'react'
import { useWineTaste } from './useWineTaste'
import { sortColorsByBrightness } from '@/lib/utils'
import { mockTastes } from '../entities/mock'
import { CreateWineTasteParams } from '../entities/types/tastes'

export const useTastePalette = () => {
  const tastes = mockTastes
  const { /*tastes,*/ isLoading, createTaste, deleteTaste } = useWineTaste()

  const [isFormOpen, setIsFormOpen] = useState<{ [tasteId: string]: boolean }>({})

  const handleAddTaste = (tasteData: CreateWineTasteParams) => {
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

  const sortedItems = useMemo(() => {
    return sortColorsByBrightness(tastes)
  }, [tastes])

  return {
    tastes: sortedItems,
    isLoading,
    isFormOpen,

    handleAddTaste,
    handleDeleteTaste,
    handleToggleForm,
    handleCancelEdit,
  }
}
