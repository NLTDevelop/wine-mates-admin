import { useCallback, useState } from 'react'
import { CreateWineColorParams } from '../entities/types/color-types'
import { createTranslations, getDisplayNames } from '@/lib/utils'
import { NameDictionary } from '../../general/entities/types'

interface UseCreateColorGroupProps {
  onCreateGroup: (groupData: Partial<CreateWineColorParams>) => void
  isLoading?: boolean
}

interface UseCreateColorGroupReturn {
  isExpanded: boolean
  formData: Partial<CreateWineColorParams>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'translations' | 'colorHex', value: string | NameDictionary[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateColorGroup = ({ onCreateGroup }: UseCreateColorGroupProps): UseCreateColorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const initialData = { translations: createTranslations('', ''), colorHex: '' }
  const [formData, setFormData] = useState<Partial<CreateWineColorParams>>(initialData)

  const updateFormData = useCallback((field: keyof CreateWineColorParams, value: string | NameDictionary[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      onCreateGroup(formData)
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
  const canCreateGroup = !!(nameUa && nameEn && formData.colorHex)

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
