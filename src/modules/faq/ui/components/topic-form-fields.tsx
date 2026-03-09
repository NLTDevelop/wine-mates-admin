import { Input } from '@/UIKit/shadcn/ui/input'
import { IQuestion, TopicCreate } from '../../enteties/types'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { CreateQuestionsList } from './create-questions-list'
import { useFaqStore } from '../../enteties/faq-store'
import { useEffect } from 'react'

interface TopicFormFieldsProps {
  formData: Partial<TopicCreate>
  onFormDataChange: (field: 'topicName' | 'questions', value: string | IQuestion[]) => void
  isLoading?: boolean
  autoFocus?: boolean
  topicId?: number
  isNew?: boolean
}

export const TopicFormFields = ({ formData, onFormDataChange, isLoading = false, autoFocus, topicId, isNew = false }: TopicFormFieldsProps) => {
  const { t } = useTranslation('faq')

  const { currentQuestions, addQuestion, resetCurrentQuestions, initializeQuestionsFromTopic, initializeEmptyQuestions, getFormattedQuestions } = useFaqStore()

  const topicName = formData.topicName || ''
  const isTopicNameFilled = topicName.trim().length > 0

  useEffect(() => {
    if (topicId) {
      initializeQuestionsFromTopic(topicId)
    } else if (isNew) {
      initializeEmptyQuestions()
    }

    return () => {
      resetCurrentQuestions()
    }
  }, [topicId, isNew])

  useEffect(() => {
    const formattedQuestions = getFormattedQuestions()
    onFormDataChange('questions', formattedQuestions)
  }, [currentQuestions])

  const handleTopicNameChange = (value: string) => {
    onFormDataChange('topicName', value)
  }

  const canAddQuestion = () => {
    if (!isTopicNameFilled) return false
    if (currentQuestions.length === 0) return true
    const lastQuestion = currentQuestions[currentQuestions.length - 1]
    return lastQuestion?.question?.trim().length > 0
  }

  const handleAddQuestion = () => {
    if (canAddQuestion()) {
      addQuestion()
    }
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">
          {t('topic_name')} <span className="text-red-500">*</span>
        </label>
        <Input value={topicName} onChange={e => handleTopicNameChange(e.target.value)} placeholder={t('topic_name')} className="w-1/2" autoFocus={autoFocus} disabled={isLoading} />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium mb-2 block">{t('questions')}</label>

        {!isTopicNameFilled ? (
          <p className="text-muted-foreground mb-4">{t('enter_topic_name')}</p>
        ) : currentQuestions.length === 0 ? (
          <p className="text-muted-foreground mb-4">{t('click_add_btn')}</p>
        ) : (
          <CreateQuestionsList />
        )}

        <div>
          <Button type="button" variant="outline" onClick={handleAddQuestion} disabled={!canAddQuestion() || isLoading === true}>
            <Plus className="w-4 h-4 mr-2" />
            {t('add_question')}
          </Button>

          {isTopicNameFilled && currentQuestions.length > 0 && !canAddQuestion() && <p className="text-xs text-muted-foreground ml-1 mt-1">{t('rule_add_next')}</p>}
        </div>
      </div>
    </div>
  )
}
