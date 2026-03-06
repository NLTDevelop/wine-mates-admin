import { useCallback, useState } from 'react'
import { IQuestion, TopicCreate } from '../enteties/types'

interface UseCreateTopicProps {
  onCreateTopic: (topicData: TopicCreate) => void
  isLoading?: boolean
}

interface useCreateTopicReturn {
  isExpanded: boolean
  formData: TopicCreate
  canCreateTopic: boolean
  setIsExpanded: (expanded: boolean) => void
  updateFormData: (field: 'topicName' | 'questions' | 'answer', value: string | IQuestion[]) => void
  handleCreateTopic: () => void
  handleCancel: () => void
  expandForm: () => void
}

export const useCreateTopic = ({ onCreateTopic }: UseCreateTopicProps): useCreateTopicReturn => {
  const [isExpanded, setIsExpanded] = useState(false)

  const initialData = { topicName: '', questions: [], answer: '' }
  const [formData, setFormData] = useState<TopicCreate>(initialData)

  const updateFormData = useCallback((field: 'topicName' | 'questions' | 'answer', value: string | IQuestion[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateTopic = () => {
    if (canCreateTopic) {
      onCreateTopic(formData)
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

  const canCreateTopic = !!formData.topicName

  return {
    isExpanded,
    formData,
    canCreateTopic,

    setIsExpanded,
    updateFormData,
    handleCreateTopic,
    handleCancel,
    expandForm,
  }
}
