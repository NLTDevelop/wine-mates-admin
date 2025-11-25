import { useState, useCallback } from 'react'
import { getDisplayNames } from '@/lib/utils'
import { CreateWineTasteCharacteristicParams, CreateWineTasteCharacteristicRequest, LevelItem } from '../entities/taste-characteristics'

interface UseCreateTasteCharacteristicProps {
  onCreateTasteCharacteristic: (wineTypeData: CreateWineTasteCharacteristicRequest) => void
  isLoading?: boolean
}

interface UseCreateTasteCharacteristicReturn {
  isExpanded: boolean
  formData: CreateWineTasteCharacteristicParams
  updateFormData: (field: 'translations' | 'colors' | 'colorHex' | 'description' | 'levels', value: any) => void
  handleCreateTasteCharacteristic: () => void
  handleCancel: () => void
  expandForm: () => void
  canCreate: boolean
}

export const useCreateTasteCharacteristic = ({ onCreateTasteCharacteristic, isLoading = false }: UseCreateTasteCharacteristicProps): UseCreateTasteCharacteristicReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const createEmptyLevels = (qty: number): LevelItem[] => {
    return Array.from({ length: qty }, (_, index) => ({
      id: `temp-level-${Date.now()}-${index}`,
      sortNumber: index,
    }))
  }

  const initialData = {
    colors: [],
    colorHex: '',
    levels: createEmptyLevels(3),
    description: '',
  }
  const [formData, setFormData] = useState<CreateWineTasteCharacteristicParams>(initialData)

  const updateFormData = useCallback((field: keyof CreateWineTasteCharacteristicParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateTasteCharacteristic = useCallback(() => {
    if (!isLoading) {
      const characteristicDataForApi: CreateWineTasteCharacteristicRequest = {
        translations: formData.translations || [],
        colorIds: formData.colors.map(color => color.id),
        colorHex: formData.colorHex,
        levels: formData.levels,
        description: formData.description,
      }
      onCreateTasteCharacteristic(characteristicDataForApi)
      setFormData(initialData)
      setIsExpanded(false)
    }
  }, [isLoading, onCreateTasteCharacteristic, formData])

  const handleCancel = useCallback(() => {
    setFormData(initialData)
    setIsExpanded(false)
  }, [])

  const expandForm = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const { nameUa, nameEn } = getDisplayNames(formData.translations || [])
  const canCreate = !!(nameUa && nameEn && formData.colors && formData.colors.length > 0 && formData.levels && formData.levels.length > 2)

  return {
    isExpanded,
    formData,
    updateFormData,
    handleCreateTasteCharacteristic,
    handleCancel,
    expandForm,
    canCreate,
  }
}
