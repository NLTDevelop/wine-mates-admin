import { useCallback, useState } from 'react'
import { CreateWineAromaGroupParams } from '../entities/types/flavor-types'
import { BaseWineColor } from '../../general/entities/types'

interface UseCreateFlavorGroupProps {
  onCreateGroup: (groupData: Partial<CreateWineAromaGroupParams>) => void
  isLoading?: boolean
}

interface UseCreateFlavorGroupReturn {
  isExpanded: boolean
  formData: Partial<CreateWineAromaGroupParams>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'nameUa' | 'nameEn' | 'colors' | 'colorHex', value: string | BaseWineColor[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateFlavorGroup = ({ onCreateGroup }: UseCreateFlavorGroupProps): UseCreateFlavorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateWineAromaGroupParams>>({
    nameUa: '',
    nameEn: '',
    colorHex: '',
    colors: [],
  })

  const updateFormData = useCallback((field: keyof CreateWineAromaGroupParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      onCreateGroup(formData)
      setFormData({ nameUa: '', nameEn: '', colorHex: '', colors: [] })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({ nameUa: '', nameEn: '', colorHex: '', colors: [] })
    setIsExpanded(false)
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

  const canCreateGroup = !!(formData.nameUa && formData.nameEn && formData.colors && formData.colors.length > 0)

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
