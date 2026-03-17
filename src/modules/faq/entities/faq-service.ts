import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { FAQ_ENDPOINTS } from './faq-endpoints'
import { ReorderItem } from '@/modules/wine/create/general/entities/types'
import { CreateQuestionParams, CreateTopicRequest, FaqQuestion, FaqTopic, UpdateQuestionParams, UpdateTopicParams } from './types/types'

export const faqService = {
  listGroups: (): Promise<FaqTopic[]> => api.get(FAQ_ENDPOINTS.GROUP.LIST).then(response => response.data),

  createGroup: (group: CreateTopicRequest): Promise<FaqTopic> => api.post(FAQ_ENDPOINTS.GROUP.CREATE, group).then(response => response.data),

  updateGroup: (params: UpdateTopicParams): Promise<FaqTopic> => api.patch(buildUrl(FAQ_ENDPOINTS.GROUP.UPDATE, { id: params.topicId }), params.newTopic).then(response => response.data),

  deleteGroup: (groupId: string): Promise<void> => api.delete(buildUrl(FAQ_ENDPOINTS.GROUP.DELETE, { id: groupId })).then(response => response.data),

  reorderGroup: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(FAQ_ENDPOINTS.GROUP.REORDER), params).then(response => response.data),

  createQuestion: (data: CreateQuestionParams & { topicId: string }): Promise<FaqQuestion> => api.post(FAQ_ENDPOINTS.QUESTION.CREATE, data).then(response => response.data),

  updateQuestion: (params: UpdateQuestionParams): Promise<FaqQuestion> =>
    api.patch(buildUrl(FAQ_ENDPOINTS.QUESTION.UPDATE, { id: params.topicId }), params.newQuestion).then(response => response.data),

  deleteQuestion: (tasteId: string): Promise<void> => api.delete(buildUrl(FAQ_ENDPOINTS.QUESTION.DELETE, { id: tasteId })).then(response => response.data),

  reorderQuestion: (params: ReorderItem[]): Promise<void> => api.patch(buildUrl(FAQ_ENDPOINTS.QUESTION.REORDER), params).then(response => response.data),
}
