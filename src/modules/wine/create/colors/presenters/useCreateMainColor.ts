import { useState } from 'react'

interface UseCreateMainColorProps {
  onCreateColor: (colorData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

interface UseCreateMainColorReturn {
  isExpanded: boolean
  formData: {
    label: string
    labelEn: string
    value: string
  }
  canCreateCategory: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (updates: Partial<{ label: string; labelEn: string; value: string }>) => void
  handleCreateColor: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateMainColor = ({ onCreateColor }: UseCreateMainColorProps): UseCreateMainColorReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    labelEn: '',
    value: '',
  })

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleCreateColor = () => {
    if (canCreateCategory) {
      onCreateColor(formData)
      setFormData({ label: '', labelEn: '', value: '' })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({ value: '', label: '', labelEn: '' })
    setIsExpanded(false)
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

  const canCreateCategory = !!(formData.value && formData.label && formData.labelEn)

  return {
    isExpanded,
    formData,
    canCreateCategory,

    setIsExpanded,
    updateFormData,
    handleCreateColor,
    handleCancel,
    expandForm,
  }
}
