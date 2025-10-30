import { useState } from 'react'

interface UseCreateFlavorGroupProps {
  onCreateGroup: (groupData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

interface UseCreateFlavorGroupReturn {
  isExpanded: boolean
  formData: {
    label: string
    labelEn: string
    value: string
  }
  canCreateGroup: boolean

  setIsExpanded: (expanded: boolean) => void
  updateFormData: (updates: Partial<{ label: string; labelEn: string; value: string }>) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateFlavorGroup = ({ onCreateGroup, isLoading = false }: UseCreateFlavorGroupProps): UseCreateFlavorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    labelEn: '',
    value: '',
  })

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      onCreateGroup(formData)
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

  const canCreateGroup = !!(formData.value && formData.label && formData.labelEn)

  return {
    isExpanded,
    formData,
    canCreateGroup,

    setIsExpanded,
    updateFormData,
    handleCreateGroup,
    handleCancel,
    expandForm,
  }
}
