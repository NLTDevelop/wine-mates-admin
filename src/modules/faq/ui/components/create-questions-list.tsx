import { AutoSizeTextarea } from '@/UIKit/app-components/auto-size-textarea'
import { useFaqStore } from '../../enteties/faq-store'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { useMemo } from 'react'
import { Trash2 } from 'lucide-react'

export const CreateQuestionsList = () => {
  const { t } = useTranslation('faq')

  const { currentQuestions, updateQuestion, removeQuestion, updateCurrentQuestionsOrder } = useFaqStore()

  const isQuestionFieldEnabled = (index: number) => {
    if (index === 0) return true
    const previousQuestion = currentQuestions[index - 1]
    return previousQuestion?.question?.trim().length > 0
  }

  const contextId = useMemo(() => 'create-questions-context', [])

  const getItemId = (question: any) => `create-question-${question.id}`

  const handleReorderQuestions = (reorderedQuestions: any[]) => {
    updateCurrentQuestionsOrder(reorderedQuestions)
  }

  return (
    <SortableList items={currentQuestions} onReorder={handleReorderQuestions} getId={question => getItemId(question)} contextId={contextId}>
      <div className="space-y-4">
        {currentQuestions.map((q, index) => {
          const isEnabled = isQuestionFieldEnabled(index)
          const isQuestionFilled = q.question?.trim().length > 0

          return (
            <SortableItem key={q.id} id={getItemId(q)} handleClassName="cursor-move" className="relative">
              <div className="space-y-3 px-8 py-2 bg-[#e4e4e4] rounded-lg relative">
                {currentQuestions.length > 0 && (
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0  h-8 w-8" onClick={() => removeQuestion(q.id)} disabled={!isEnabled}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div className="flex items-start gap-2">
                  <div className="w-1/2">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {t('question')} {index + 1}
                    </label>
                    <AutoSizeTextarea
                      value={q.question || ''}
                      onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder={t('question')}
                      className="w-full bg-card"
                      disabled={!isEnabled}
                    />
                  </div>
                  {isQuestionFilled && (
                    <div className="w-1/2">
                      <label className="text-xs text-muted-foreground mb-1 block">{t('answer')}</label>
                      <AutoSizeTextarea
                        value={q.answer || ''}
                        onChange={e => updateQuestion(q.id, 'answer', e.target.value)}
                        placeholder={t('answer')}
                        className="w-full bg-card"
                        disabled={!isEnabled}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SortableItem>
          )
        })}
      </div>
    </SortableList>
  )
}
