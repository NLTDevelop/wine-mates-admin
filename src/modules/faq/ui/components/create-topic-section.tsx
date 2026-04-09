import { useTranslation } from 'react-i18next'
import { useCreateTopic } from '../../presenters/useCreateTopic'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, CircleQuestionMark } from 'lucide-react'
import { TopicFormFields } from './topic-form-field'
import { CreateTopicRequest } from '../../entities/types/types'

interface CreateTopicSectionProps {
  onCreateGroup: (groupData: CreateTopicRequest) => void
  isLoading?: boolean
}

export const CreateTopicSection = ({ onCreateGroup, isLoading = false }: CreateTopicSectionProps) => {
  const { t } = useTranslation('faq')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateGroup, updateFormData, handleCreateGroup, handleCancel, expandForm } = useCreateTopic({
    onCreateGroup,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div>
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6 mt-6">
          <div />
          <Button onClick={expandForm} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('create_new_topic')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="border border-dashed p-0 mt-6">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CircleQuestionMark className="w-5 h-5" />
            {t('creating_new_topic')}
          </h3>
        </CardHeader>

        <TopicFormFields formData={formData} onFormDataChange={updateFormData} />

        <div className="flex justify-end gap-2 flex-col sm:flex-row mt-4">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateGroup} disabled={!canCreateGroup || isLoading}>
            <Plus className="w-4 h-4" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
