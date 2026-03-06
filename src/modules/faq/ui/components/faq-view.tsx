import { TopicsList } from './topics-list'
import { TopicRequest } from '../../enteties/types'
import { useFaqStore } from '../../enteties/faq-store'
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'

export const FaqView = () => {
  const { t } = useTranslation('faq')

  const topics = useFaqStore(s => s.topics)
  const updateTopicsOrder = useFaqStore(s => s.updateTopicsOrder)

  //   const { isExpanded, formData, canCreateTopic, updateFormData, handleCreateTopic, handleCancel, expandForm } = useCreateTopic({ onCreateTopic, isLoading })
  const handleReorderTopics = (reorderedTopics: TopicRequest) => {
    updateTopicsOrder(reorderedTopics)
  }

  const isExpanded = false

  return (
    <ContentLayout title={t('faq')}>
      {!isExpanded && (
        <div className="text-end mb-4">
          <Button /*onClick={expandForm}*/ className="w-full sm:w-auto ">
            <Plus className="w-4 h-4" />
            {t('button.create_new_topic')}
          </Button>
        </div>
      )}
      <TopicsList onReorderTopics={handleReorderTopics} topics={topics} />
    </ContentLayout>
  )
}
