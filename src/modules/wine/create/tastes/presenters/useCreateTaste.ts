import { useState, useCallback } from 'react'
import { CreateWineTasteParams } from '../entities/types/tastes'

interface UseCreateTasteProps {
  onCreateTaste: (tasteData: CreateWineTasteParams) => void
  isLoading?: boolean
}

interface UseCreateTasteReturn {
  isExpanded: boolean
  formData: CreateWineTasteParams
  canCreateTaste: boolean
  updateFormData: (field: 'label' | 'labelEn' | 'colors' | 'value', value: any) => void
  handleCreateTaste: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTaste = ({ onCreateTaste, isLoading = false }: UseCreateTasteProps): UseCreateTasteReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTasteParams>({
    label: '',
    labelEn: '',
    value: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineTasteParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const canCreateTaste = !!(formData.label && formData.labelEn && formData.value)

  const handleCreateTaste = useCallback(() => {
    if (canCreateTaste && !isLoading) {
      onCreateTaste(formData)
      setFormData({ label: '', labelEn: '', value: '', colors: [] })
      setIsExpanded(false)
    }
  }, [canCreateTaste, isLoading, onCreateTaste, formData])

  const handleCancel = useCallback(() => {
    setFormData({ label: '', labelEn: '', value: '', colors: [] })
    setIsExpanded(false)
  }, [])

  const expandForm = useCallback(() => {
    setIsExpanded(true)
  }, [])

  return {
    isExpanded,
    formData,
    canCreateTaste,
    updateFormData,
    handleCreateTaste,
    handleCancel,
    expandForm,
  }
}
