import { useCallback, useState } from 'react'
import { createTranslations, getDisplayNames } from '@/lib/utils'
import { CreateTopicParams, CreateTopicRequest } from '../entities/types/types'
import { NameDictionary } from '@/modules/wine/create/general/entities/types'

interface UseCreateTopicProps {
  onCreateGroup: (groupData: CreateTopicRequest) => void
  isLoading?: boolean
}

interface UseCreateTopicsReturn {
  isExpanded: boolean
  formData: Omit<CreateTopicParams, 'sortNumber' | 'questions'>
  canCreateGroup: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'translations', value: string | NameDictionary[]) => void
  handleCreateGroup: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTopic = ({ onCreateGroup }: UseCreateTopicProps): UseCreateTopicsReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const initialData = { translations: createTranslations('', '') }
  const [formData, setFormData] = useState<Omit<CreateTopicParams, 'sortNumber' | 'questions'>>(initialData)

  const updateFormData = useCallback((field: keyof CreateTopicParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateGroup = () => {
    if (canCreateGroup) {
      const groupDataForApi: CreateTopicRequest = {
        translations: formData.translations || [],
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
