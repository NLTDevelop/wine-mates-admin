import { useCallback, useState } from 'react'
import { CreateWineAromaGroupParams,  } from '../entities/types/flavor'

interface UseCreateFlavorGroupProps {
  onCreateGroup: (groupData: Partial<CreateWineAromaGroupParams>) => void
  isLoading?: boolean
}

interface UseCreateFlavorGroupReturn {
  isExpanded: boolean
  formData: Partial<CreateWineAromaGroupParams>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'label' | 'labelEn' | 'colors' | 'value', value: any) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateFlavorGroup = ({ onCreateGroup }: UseCreateFlavorGroupProps): UseCreateFlavorGroupReturn => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateWineAromaGroupParams>>({
    label: '',
    labelEn: '',
    value: '',
    colors: [] 
  })

   const updateFormData = useCallback((field: keyof CreateWineAromaGroupParams, value: any) => {
     setFormData(prev => ({ ...prev, [field]: value }))
   }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      onCreateGroup(formData)
      setFormData({ label: '', labelEn: '', value: '', colors: [] })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({ value: '', label: '', labelEn: '', colors: [] })
    setIsExpanded(false)
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

  const canCreateGroup = !!(formData.label && formData.labelEn && formData.colors &&  formData.colors.length>0)

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
