import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { IQuestion, ITopic, TopicRequest } from '../../enteties/types'
import { QuestionsList } from './questions-list'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { useFaqStore } from '../../enteties/faq-store'

interface TopicsListProps {
  topics: TopicRequest
  onReorderTopics: (reorderedTopics: TopicRequest) => void
}

export const TopicsList = ({ topics, onReorderTopics }: TopicsListProps) => {
  const getId = (topic: ITopic) => `topic-${topic.id}`

  const updateQuestionsOrder = useFaqStore(state => state.updateQuestionsOrder)

  const handleReorderQuestions = (topicId: number) => (reorderedQuestions: IQuestion[]) => {
    updateQuestionsOrder(topicId, reorderedQuestions)
  }

  return (
    <SortableList items={topics} onReorder={onReorderTopics} getId={item => getId(item)}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-3 auto-rows-fr">
        {topics.map(topic => (
          <SortableItem key={topic.id} id={getId(topic)} handleClassName="top-2" className="h-full">
            <Card className="w-full !p-0 bg-foreground/10 h-full">
              <CardContent className="!p-2 flex flex-col h-full">
                <div className="flex justify-between items-center">
                  <span />
                  <PaletteItemActions
                    onEdit={() => console.log('edit', topic.id)}
                    deleteModal={() => console.log('delete modal')}
                    isLoading={false}
                    onRemove={() => console.log('remove', topic.id)}
                    dataId={topic.id.toString()}
                    showEditButton
                  />
                </div>

                <h2 className="text-xl font-bold mb-2 pl-6">{topic.topicName}</h2>

                <div className="flex-1 overflow-auto">
                  <QuestionsList questions={topic.questions || []} onReorderQuestions={handleReorderQuestions(topic.id)} topicId={topic.id} />
                </div>
              </CardContent>
            </Card>
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}
