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
  updateFormData: (field: /*'nameUa' | 'nameEn'*/'translations' | 'colors', value: any) => void
  handleCreateWineType: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateWineType = ({ onCreateWineType, isLoading = false }: UseCreateWineTypeProps): UseCreateWineTypeReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<CreateWineTypeParams>({
    // nameUa: '',
    // nameEn: '',
    translations: createTranslations('',''),
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineTypeParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateWineType = useCallback(() => {
    if (!isLoading) {
      const wineTypeDataForApi: CreateWineTypeRequest = {
        // nameUa: formData.nameUa,
        // nameEn: formData.nameEn,
         translations: formData.translations || [],
        colorIds: formData.colors.map(color => color.id),
      }
      onCreateWineType(wineTypeDataForApi)
      setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colors: [] })
      setIsExpanded(false)
    }
  }, [isLoading, onCreateWineType, formData])

  const handleCancel = useCallback(() => {
    setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colors: [] })
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
