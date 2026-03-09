import { TopicsList } from './topics-list'
import { TopicRequest } from '../../enteties/types'
import { useFaqStore } from '../../enteties/faq-store'
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Plus } from 'lucide-react'
import { CreateFaqSection } from './create-faq-section'
import { useFaqTopics } from '../../presenters/useFaqTopics'

export const FaqView = () => {
  const { t } = useTranslation('faq')

  const topics = useFaqStore(s => s.topics)
  const updateTopicsOrder = useFaqStore(s => s.updateTopicsOrder)
  const editingTopicData = useFaqStore(s => s.editingTopicData)
  const setEditingTopic = useFaqStore(s => s.setEditingTopic)
  const setEditingTopicData = useFaqStore(s => s.setEditingTopicData)
  const setNewItemData = useFaqStore(s => s.setNewItemData)

  const handleReorderTopics = (reorderedTopics: TopicRequest) => {
    updateTopicsOrder(reorderedTopics)
  }

  const { handleAddTopic, isLoading } = useFaqTopics({ topics, editingTopicData, setEditingTopic, setEditingTopicData, setNewItemData })

  return (
    <ContentLayout title={t('faq')}>
      <div>
        <CreateFaqSection onCreateTopic={handleAddTopic} isLoading={isLoading || handleReorderTopics} />
      </div>
      <TopicsList onReorderTopics={handleReorderTopics} topics={topics} />
    </ContentLayout>
  )
}
