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
  updateFormData: (field: /*'nameUa' | 'nameEn'*/"translations" | 'colors' | 'colorHex', value: string | BaseWineColor[] | NameDictionary[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateFlavorGroup = ({ onCreateGroup }: UseCreateFlavorGroupProps): UseCreateFlavorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<Omit<CreateWineAromaGroupParams, 'sortNumber' | 'subgroups'>> ({
    // nameUa: '',
    // nameEn: '',
     translations: createTranslations('',''),
    colorHex: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineAromaGroupParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      const groupDataForApi: CreateWineAromaGroupRequest = {
        // nameUa: formData.nameUa || '',
        // nameEn: formData.nameEn || '',
        translations: formData.translations || [],
        colorHex: formData.colorHex || '',
        colorIds: formData.colors.map(color => color.id),
      }

      onCreateGroup(groupDataForApi)
      setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colorHex: '', colors: [] })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({ /*nameUa: '', nameEn: ''*/translations: createTranslations('',''), colorHex: '', colors: [] })
    setIsExpanded(false)
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

   const { nameUa, nameEn } = getDisplayNames(formData.translations || [])
  const canCreateGroup = !!(/*formData.*/nameUa && /*formData.*/nameEn && formData.colors && formData.colors.length > 0 )

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
