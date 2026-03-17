import { Language, NameDictionary } from '@/modules/wine/create/general/entities/types'

export interface IDictionary {
  id?: string
  language: Language
  name?: string
}

export interface QuestionDictionary extends IDictionary {
  question: string
}
export interface AnswerDictionary extends IDictionary {
  answer: string
}

export interface FaqQuestion {
  id: string
  questionTranslations: NameDictionary[]
  answerTranslations: NameDictionary[]
  sortNumber: number
  topicId?: number
}

export interface FaqTopic {
  id: string
  nameUa?: string
  nameEn?: string
  translations: NameDictionary[]
  sortNumber: number
  questions?: FaqQuestion[]
}

export interface CreateTopicParams {
  translations: NameDictionary[]
  sortNumber: number
}

export interface UpdateTopicParams {
  topicId: string
  newTopic: CreateTopicRequest
}

export interface CreateTopicRequest {
  translations: NameDictionary[]
  sortNumber?: number
}

export interface CreateQuestionData {
  questionTranslations: QuestionDictionary[]
  answerTranslations: AnswerDictionary[]
  sortNumber?: number
}

export interface CreateQuestionParams {
  topicId: string
  translations: Array<{
    language: Language
    question?: string
    answer?: string
  }>
  sortNumber?: number
}

export interface UpdateQuestionParams {
  topicId: string
  newQuestion?: CreateQuestionParams
}

export interface ReorderQuestionParams {
  topicId: string
  questionIds: string[]
}
