import { useState, useCallback } from 'react'
import { CreateWineTasteParams, CreateWineTasteRequest } from '../entities/types/tastes'
import { createTranslations } from '@/lib/utils'

interface UseCreateTasteProps {
  onCreateTaste: (tasteData: CreateWineTasteRequest) => void
  isLoading?: boolean
}

interface UseCreateTasteReturn {
  isExpanded: boolean
  formData: CreateWineTasteParams
  updateFormData: (field: /*'nameUa' | 'nameEn'*/"translations" | 'colors' | 'colorHex', value: any) => void
  handleCreateTaste: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTaste = ({ onCreateTaste, isLoading = false }: UseCreateTasteProps): UseCreateTasteReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTasteParams>({
    // nameUa: '',
    // nameEn: '',
    translations: createTranslations('',''),
    colorHex: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineTasteParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateTaste = useCallback(() => {
    if (!isLoading) {
      const tasteDataForApi: CreateWineTasteRequest = {
        // nameUa: formData.nameUa,
        // nameEn: formData.nameEn,
        translations: formData.translations || [],
        colorHex: formData.colorHex,
        colorIds: formData.colors.map(color => color.id),
      }
      onCreateTaste(tasteDataForApi)
      setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colorHex: '', colors: [] })
      setIsExpanded(false)
    }
  }, [isLoading, onCreateTaste, formData])

  const handleCancel = useCallback(() => {
    setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colorHex: '', colors: [] })
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
