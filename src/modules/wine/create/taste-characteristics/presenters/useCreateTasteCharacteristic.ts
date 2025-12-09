import { useState, useCallback } from 'react'
import { getDisplayNameDescription } from '@/lib/utils'
import { CreateWineTasteCharacteristicParams, CreateWineTasteCharacteristicRequest, LevelItem } from '../entities/taste-characteristics'
import { convertToCreateTranslations } from '../../general/presenters/helper'
import { NameDictionary } from '../../general/entities/types'

interface UseCreateTasteCharacteristicProps {
  onCreateTasteCharacteristic: (wineTypeData: CreateWineTasteCharacteristicRequest) => void
  isLoading?: boolean
}

interface UseCreateTasteCharacteristicReturn {
  isExpanded: boolean
  formData: CreateWineTasteCharacteristicParams
  updateFormData: (field: keyof CreateWineTasteCharacteristicParams, value: any) => void
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
      isEnabled: true,
    }))
  }

  const initialData: CreateWineTasteCharacteristicParams = {
    colors: [],
    colorHex: '',
    levels: createEmptyLevels(3),
    translations: [],
    isPremium: false,
    sortNumber: 1,
  }
  const [formData, setFormData] = useState<CreateWineTasteCharacteristicParams>(initialData)

  const updateFormData = useCallback((field: keyof CreateWineTasteCharacteristicParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateTasteCharacteristic = useCallback(() => {
    if (!isLoading) {
      const characteristicDataForApi: CreateWineTasteCharacteristicRequest = {
        translations: convertToCreateTranslations(formData.translations),
        colorIds: formData.colors.map(color => color.id),
        colorHex: formData.colorHex,
        levels: formData.levels,
        isPremium: false,
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

  const { nameUa, nameEn } = getDisplayNameDescription(formData.translations || [])

  const hasValidLevelTranslations = (levels: LevelItem[] | undefined): boolean => {
    if (!levels || levels.length === 0) return false

    return levels.every((level: LevelItem) => {
      if (!level.translations || level.translations.length === 0) return false

      const hasUa = level.translations.some((t: NameDictionary) => t.language === 'uk' && t.name && t.name.trim() !== '')

      const hasEn = level.translations.some((t: NameDictionary) => t.language === 'en' && t.name && t.name.trim() !== '')

      return hasUa && hasEn
    })
  }

  const canCreate = !!(nameUa && nameEn && formData.colors && formData.colors.length > 0 && formData.levels && formData.levels.length > 2 && hasValidLevelTranslations(formData.levels))

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
