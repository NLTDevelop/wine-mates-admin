import { useState, useCallback } from 'react'
import { CreateWineTypeParams, CreateWineTypeRequest } from '../entities/types/wine-type'
import { createTranslations } from '@/lib/utils'

interface UseCreateWineTypeProps {
  onCreateWineType: (wineTypeData: CreateWineTypeRequest) => void
  isLoading?: boolean
}

interface UseCreateWineTypeReturn {
  isExpanded: boolean
  formData: CreateWineTypeParams
  updateFormData: (field: 'translations' | 'isSparkling', value: any) => void
  handleCreateWineType: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateWineType = ({ onCreateWineType, isLoading = false }: UseCreateWineTypeProps): UseCreateWineTypeReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTypeParams>({
    translations: createTranslations('', ''),
    isSparkling: false,
  })

  const updateFormData = useCallback((field: keyof CreateWineTypeParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateWineType = useCallback(() => {
    if (!isLoading) {
      const wineTypeDataForApi: CreateWineTypeRequest = {
        translations: formData.translations || [],
        isSparkling: formData.isSparkling,
      }
      onCreateWineType(wineTypeDataForApi)
      setFormData({ translations: createTranslations('', '') })
      setIsExpanded(false)
    }
  }, [isLoading, onCreateWineType, formData])

  const handleCancel = useCallback(() => {
    setFormData({ translations: createTranslations('', '') })
    setIsExpanded(false)
  }, [])

  const expandForm = useCallback(() => {
    setIsExpanded(true)
  }, [])

  return {
    isExpanded,
    formData,
    updateFormData,
    handleCreateWineType,
    handleCancel,
    expandForm,
  }
}
