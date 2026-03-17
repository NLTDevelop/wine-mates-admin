import { NameDictionary } from '@/modules/wine/create/general/entities/types'
import { AnswerDictionary, CreateQuestionParams, CreateQuestionData, FaqQuestion, QuestionDictionary } from './types'

export const transformUIToAPI = (data: CreateQuestionData, topicId: string, sortNumber?: number): CreateQuestionParams => ({
  topicId: topicId,
  translations: [
    ...(data.questionTranslations?.map((qt: QuestionDictionary) => ({
      language: qt.language,
      question: qt.name,
    })) || []),
    ...(data.answerTranslations?.map((at: AnswerDictionary) => ({
      language: at.language,
      answer: at.name,
    })) || []),
  ],
  ...(sortNumber !== undefined && { sortNumber }),
})

export const transformAPIToUI = (questionTranslations: any[] = [], answerTranslations: any[] = []): { questionTranslations: NameDictionary[]; answerTranslations: NameDictionary[] } => ({
  questionTranslations: questionTranslations.map(qt => ({
    id: qt.id,
    language: qt.language,
    name: qt.question,
  })),
  answerTranslations: answerTranslations.map(at => ({
    id: at.id,
    language: at.language,
    name: at.answer,
  })),
})

export const transformQuestionAPIToUI = (apiQuestion: any): FaqQuestion => {
  const { questionTranslations, answerTranslations } = transformAPIToUI(apiQuestion.questionTranslations || [], apiQuestion.answerTranslations || [])

  return {
    id: apiQuestion.id,
    questionTranslations,
    answerTranslations,
    sortNumber: apiQuestion.sortNumber,
    topicId: apiQuestion.topicId || apiQuestion.groupId,
  }
}

export const transformQuestionDictToNameDict = (dict: QuestionDictionary[]): NameDictionary[] => {
  return dict.map(item => ({
    id: item.id,
    language: item.language,
    name: item.question,
  }))
}

export const transformAnswerDictToNameDict = (dict: AnswerDictionary[]): NameDictionary[] => {
  return dict.map(item => ({
    id: item.id,
    language: item.language,
    name: item.answer,
  }))
}
