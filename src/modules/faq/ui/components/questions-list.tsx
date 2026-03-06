import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { IQuestion } from '../../enteties/types'
import { Accordion, AccordionItem, AccordionTrigger } from '@/UIKit/shadcn/ui/accordion'
import { Card } from '@/UIKit/shadcn/ui/card'
import { AccordionContent } from '@radix-ui/react-accordion'
import { useMemo } from 'react'

interface QuestionsListProps {
  questions: IQuestion[]
  onReorderQuestions: (reorderedQuestions: IQuestion[]) => void
  topicId: number
}

export const QuestionsList = ({ questions, onReorderQuestions, topicId }: QuestionsListProps) => {
  const getItemId = (question: IQuestion) => `question-${topicId}-${question.id}`
  const contextId = useMemo(() => `questions-context-${topicId}`, [topicId])

  return (
    <SortableList items={questions} onReorder={onReorderQuestions} getId={question => getItemId(question)} contextId={contextId}>
      <div className="space-y-2 pl-6">
        {questions.map((q, idx) => {
          return (
            <SortableItem id={getItemId(q)} key={`${q.id}_${idx}`} handleClassName="top-[9px]" className="w-full">
              <Accordion type="single" collapsible defaultValue={q.question}>
                <Card className="w-full !px-3 !py-2">
                  <AccordionItem value={`question-${q.id}_${idx}`} className="border-none">
                    <AccordionTrigger>
                      <h3 className="pl-6 text-lg font-medium text-left">{q.question}</h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pt-2">
                      <div className="text-muted-foreground">{q.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              </Accordion>
            </SortableItem>
          )
        })}
      </div>
    </SortableList>
  )
}
