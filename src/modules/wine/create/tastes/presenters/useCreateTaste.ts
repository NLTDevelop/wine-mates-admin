import { useState, useCallback } from 'react'
import { CreateWineTasteParams, CreateWineTasteRequest } from '../entities/types/tastes'

interface UseCreateTasteProps {
  onCreateTaste: (tasteData: CreateWineTasteRequest) => void
  isLoading?: boolean
}

interface UseCreateTasteReturn {
  isExpanded: boolean
  formData: CreateWineTasteParams
  updateFormData: (field: 'nameUa' | 'nameEn' | 'colors' | 'value', value: any) => void
  handleCreateTaste: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTaste = ({ onCreateTaste, isLoading = false }: UseCreateTasteProps): UseCreateTasteReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTasteParams>({
    nameUa: '',
    nameEn: '',
    value: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineTasteParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateTaste = useCallback(() => {
    if (!isLoading) {
      const tasteDataForApi: CreateWineTasteRequest = {
        nameUa: formData.nameUa,
        nameEn: formData.nameEn,
        value: formData.value,
        colors: formData.colors.map(color => color.id),
      }
      onCreateTaste(tasteDataForApi)
      setFormData({ nameUa: '', nameEn: '', value: '', colors: [] })
      setIsExpanded(false)
    }
  }, [isLoading, onCreateTaste, formData])

  const handleCancel = useCallback(() => {
    setFormData({ nameEn: '', nameUa: '', value: '', colors: [] })
    setIsExpanded(false)
  }, [])

  const expandForm = useCallback(() => {
    setIsExpanded(true)
  }, [])

  return {
    isExpanded,
    formData,
    updateFormData,
    handleCreateTaste,
    handleCancel,
    expandForm,
  }
}
