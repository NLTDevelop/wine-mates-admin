import { useCallback, useState } from 'react'
import { BaseWineColor, NameDictionary } from '../../general/entities/types'
import { createTranslations, getDisplayNames } from '@/lib/utils'
import { CreateWineTasteGroupParams, CreateWineTasteGroupRequest } from '../entities/types/tastes'

interface UseCreateFlavorGroupProps {
  onCreateGroup: (groupData: CreateWineTasteGroupRequest) => void
  isLoading?: boolean
}

interface UseCreateTasteGroupReturn {
  isExpanded: boolean
  formData: Omit<CreateWineTasteGroupParams, 'sortNumber' | 'taste'>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'translations' | 'colorHex', value: string | BaseWineColor[] | NameDictionary[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTasteGroup = ({ onCreateGroup }: UseCreateFlavorGroupProps): UseCreateTasteGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const initialData = { translations: createTranslations('', ''), colorHex: '' }
  const [formData, setFormData] = useState<Omit<CreateWineTasteGroupParams, 'sortNumber' | 'taste'>>(initialData)

  const updateFormData = useCallback((field: keyof CreateWineTasteGroupParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      const groupDataForApi: CreateWineTasteGroupRequest = {
        translations: formData.translations || [],
        colorHex: formData.colorHex || '',
      }

      onCreateGroup(groupDataForApi)
      setFormData(initialData)
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsExpanded(false)
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

  const { nameUa, nameEn } = getDisplayNames(formData.translations || [])
  const canCreateGroup = !!(nameUa && nameEn)

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
