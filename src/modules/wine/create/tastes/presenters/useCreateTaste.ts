import { useState, useCallback } from 'react'

interface UseCreateTasteProps {
  onCreateTaste: (tasteData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

interface UseCreateTasteReturn {
  isExpanded: boolean
  formData: {
    label: string
    labelEn: string
    value: string
  }
  canCreateTaste: boolean
  updateFormData: (updates: Partial<{ label: string; labelEn: string; value: string }>) => void
  handleCreateTaste: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTaste = ({ 
  onCreateTaste, 
  isLoading = false 
}: UseCreateTasteProps): UseCreateTasteReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    labelEn: '',
    value: ''
  })

  const updateFormData = useCallback((updates: Partial<{ label: string; labelEn: string; value: string }>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const canCreateTaste = !!(formData.label && formData.labelEn && formData.value)

  const handleCreateTaste = useCallback(() => {
    if (canCreateTaste && !isLoading) {
      onCreateTaste(formData)
      setFormData({ label: '', labelEn: '', value: '' })
      setIsExpanded(false)
    }
  }, [canCreateTaste, isLoading, onCreateTaste, formData])

  const handleCancel = useCallback(() => {
    setFormData({ label: '', labelEn: '', value: '' })
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