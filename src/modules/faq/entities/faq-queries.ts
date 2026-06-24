import { ReorderItem } from '@/modules/wine/create/general/entities/types'
import { CreateQuestionParams, CreateTopicRequest, UpdateQuestionParams, UpdateTopicParams } from './types/types'
import { faqService } from './faq-service'

export const topicQueries = {
  listGroups: () => ({
    queryKey: ['topic', 'list'],
    queryFn: () => faqService.listGroups(),
  }),

  createGroup: () => ({
    mutationKey: ['topic', 'create'],
    mutationFn: (group: CreateTopicRequest) => faqService.createGroup(group),
  }),

  updateGroup: () => ({
    mutationKey: ['topic', 'update'],
    mutationFn: (params: UpdateTopicParams) => faqService.updateGroup(params),
  }),

  deleteGroup: () => ({
    mutationKey: ['topic', 'delete'],
    mutationFn: (groupId: string) => faqService.deleteGroup(groupId),
  }),

  reorderGroup: () => ({
    mutationKey: ['topic', 'reorder'],
    mutationFn: (params: ReorderItem[]) => faqService.reorderGroup(params),
  }),

  createQuestion: () => ({
    mutationKey: ['question', 'create'],
    mutationFn: ({ topicId, questionData }: { topicId: string; questionData: CreateQuestionParams }) =>
      faqService.createQuestion({
        ...questionData,
        topicId,
      }),
  }),

  updateQuestion: () => ({
    mutationKey: ['question', 'update'],
    mutationFn: (params: UpdateQuestionParams) => faqService.updateQuestion(params),
  }),

  deleteQuestion: () => ({
    mutationKey: ['question', 'delete'],
    mutationFn: ({ questionId }: { topicId: string; questionId: string }) => faqService.deleteQuestion(questionId),
  }),

  reorderQuestion: () => ({
    mutationKey: ['question', 'reorder'],
    mutationFn: (params: ReorderItem[]) => faqService.reorderQuestion(params),
  }),
}
