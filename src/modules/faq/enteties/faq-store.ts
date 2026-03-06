import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IQuestion, TopicRequest } from './types'
import { mockTopics } from '../presenters/mock'

interface FaqState {
  topics: TopicRequest
  reorderedQuestions: IQuestion[]
  setTopics: (topics: TopicRequest) => void
  updateTopicsOrder: (reorderedTopics: TopicRequest) => void
  updateQuestionsOrder: (topicId: number, reorderedQuestions: IQuestion[]) => void
  addTopic: (topic: TopicRequest[number]) => void
  updateTopic: (id: number, updatedTopic: Partial<TopicRequest[number]>) => void
  deleteTopic: (id: number) => void
}

export const useFaqStore = createStoreDevToolsWrapper<FaqState>(set => ({
  topics: mockTopics,
  reorderedQuestions: [],
  // topics: [],

  setTopics: topics => set({ topics }),

  updateTopicsOrder: reorderedTopics => set({ topics: reorderedTopics }),

  updateQuestionsOrder: (topicId, reorderedQuestions) =>
    set((state: FaqState) => ({
      topics: state.topics.map(topic => (topic.id === topicId ? { ...topic, questions: reorderedQuestions } : topic)),
    })),

  addTopic: topic =>
    set((state: FaqState) => ({
      topics: [...state.topics, topic],
    })),

  updateTopic: (id, updatedTopic) =>
    set((state: FaqState) => ({
      topics: state.topics.map(topic => (topic.id === id ? { ...topic, ...updatedTopic } : topic)),
    })),

  deleteTopic: id =>
    set((state: FaqState) => ({
      topics: state.topics.filter(topic => topic.id !== id),
    })),
}))
