import { Button } from '@/UIKit/shadcn/ui/button'
import { HelpCircle, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TopicCreate } from '../../enteties/types'
import { useCreateTopic } from '../../presenters/useCreateTopic'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { TopicFormFields } from './topic-form-fields'

interface CreateFaqSectionProps {
  onCreateTopic: (topicData: Partial<TopicCreate>) => void
  isLoading?: boolean
}

export const CreateFaqSection = ({ onCreateTopic, isLoading }: CreateFaqSectionProps) => {
  const { t } = useTranslation('faq')
  const { t:tc } = useTranslation('common')

  const { isExpanded, formData, canCreateTopic, updateFormData, handleCreateTopic, handleCancel, expandForm } = useCreateTopic({ onCreateTopic, isLoading })

  if (!isExpanded) {
    return (
      <div className="text-end mb-4">
        <Button onClick={expandForm} className="w-full sm:w-auto ">
          <Plus className="w-4 h-4" />
          {t('create_new_topic')}
        </Button>
      </div>
    )
  }

  return <Card className="border-1 border-dashed p-0 mb-4">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {t('creating_new_topic')}
          </h3>
        </CardHeader>

        <TopicFormFields formData={formData} onFormDataChange={updateFormData} isLoading={isLoading} isNew={true}/>

        <div className="flex justify-end gap-2 flex-col sm:flex-row mt-4">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading===true}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateTopic} disabled={!canCreateTopic || isLoading===true}>
            <Plus className="w-4 h-4" />
            {isLoading===true ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
}
