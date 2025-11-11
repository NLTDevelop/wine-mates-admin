import { useState, useCallback } from 'react'
import { CreateWineTypeParams } from '../entities/types/wine-type'


interface UseCreateWineTypeProps {
  onCreateWineType: (wineTypeData: CreateWineTypeParams) => void
  isLoading?: boolean
}

interface UseCreateWineTypeReturn {
  isExpanded: boolean
  formData: CreateWineTypeParams
  canCreateWineType: boolean
  updateFormData: (field: 'label' | 'labelEn' | 'colors', value: any) => void
  handleCreateWineType: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateWineType = ({ onCreateWineType, isLoading = false }: UseCreateWineTypeProps): UseCreateWineTypeReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTypeParams>({
    label: '',
    labelEn: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineTypeParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const canCreateWineType = !!(formData.label && formData.labelEn && formData.colors?.length)

  const handleCreateWineType = useCallback(() => {
    if (canCreateWineType && !isLoading) {
      onCreateWineType(formData)
      setFormData({ label: '', labelEn: '', colors: [] })
      setIsExpanded(false)
    }
  }, [canCreateWineType, isLoading, onCreateWineType, formData])

  const handleCancel = useCallback(() => {
    setFormData({ label: '', labelEn: '', colors: [] })
    setIsExpanded(false)
  }, [])

  const expandForm = useCallback(() => {
    setIsExpanded(true)
  }, [])

  return {
    isExpanded,
    formData,
    canCreateWineType,
    updateFormData,
    handleCreateWineType,
    handleCancel,
    expandForm,
  }
}
