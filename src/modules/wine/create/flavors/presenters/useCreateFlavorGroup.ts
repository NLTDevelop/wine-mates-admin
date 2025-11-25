import { useCallback, useState } from 'react'
import { CreateWineAromaGroupParams, CreateWineAromaGroupRequest } from '../entities/types/flavor-types'
import { BaseWineColor, NameDictionary } from '../../general/entities/types'
import { createTranslations, getDisplayNames } from '@/lib/utils'

interface UseCreateFlavorGroupProps {
  onCreateGroup: (groupData: CreateWineAromaGroupRequest) => void
  isLoading?: boolean
}

interface UseCreateFlavorGroupReturn {
  isExpanded: boolean
  formData: Omit<CreateWineAromaGroupParams, 'sortNumber' | 'subgroups'>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'translations' | 'colors' | 'colorHex', value: string | BaseWineColor[] | NameDictionary[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateFlavorGroup = ({ onCreateGroup }: UseCreateFlavorGroupProps): UseCreateFlavorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const initialData = { translations: createTranslations('', ''), colorHex: '', colors: [] }
  const [formData, setFormData] = useState<Omit<CreateWineAromaGroupParams, 'sortNumber' | 'subgroups'>>(initialData)

  const updateFormData = useCallback((field: keyof CreateWineAromaGroupParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      const groupDataForApi: CreateWineAromaGroupRequest = {
        translations: formData.translations || [],
        colorHex: formData.colorHex || '',
        colorIds: formData.colors.map(color => color.id),
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
  const canCreateGroup = !!(nameUa && nameEn && formData.colors && formData.colors.length > 0)

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
