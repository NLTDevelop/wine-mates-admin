import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { FaqQuestion, FaqTopic } from './types/types'
import { ReorderItem } from '@/modules/wine/create/general/entities/types'

interface TopicStoreState {
  topics: FaqTopic[]
  currentTopic: FaqTopic | null
  filters: {
    search: string
    limit: number
    page: number
    include?: string[]
  }

  setTopics: (topics: FaqTopic[]) => void
  setCurrentTopic: (topic: FaqTopic | null) => void
  addTopic: (topic: FaqTopic) => void
  updateTopic: (topicId: string, newTopic: FaqTopic) => void
  deleteTopic: (topicId: string) => void
  reorderTopics: (item: ReorderItem[]) => void
  setFilters: (filters: Partial<TopicStoreState['filters']>) => void
  resetFilters: () => void

  addQuestion: (topicId: string, question: FaqQuestion) => void
  updateQuestion: (topicId: string, questionId: string, newQuestion: FaqQuestion) => void
  deleteQuestion: (topicId: string, questionId: string) => void
  reorderQuestions: (topicId: string, questions: FaqQuestion[]) => void

  getTopicById: (id: string) => FaqTopic | undefined
  hasTopic: (id: string) => boolean
}

export const useFaqStore = createStoreDevToolsWrapper<TopicStoreState>(
  (set, get) => ({
    topics: [],
    currentTopic: null,
    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      include: ['taste'],
    },

    setTopics: groups => set({ topics: groups }, false, 'topics/setTopics'),

    setCurrentTopic: group => set({ currentTopic: group }, false, 'topics/setCurrentTopic'),

    addTopic: group =>
      set(
        (state: TopicStoreState) => ({
          topics: [...state.topics, group],
        }),
        false,
        'topics/addTopic'
      ),

    updateTopic: (topicId, newTopic) =>
      set(
        (state: TopicStoreState) => ({
          topics: state.topics.map(t => (t.id === topicId ? newTopic : t)),
          currentTopic: state.currentTopic?.id === topicId ? newTopic : state.currentTopic,
        }),
        false,
        'topics/updateTopic'
      ),

    deleteTopic: topicId =>
      set(
        (state: TopicStoreState) => ({
          tasteGroups: state.topics.filter(t => t.id !== topicId),
          currentTasteGroup: state.currentTopic?.id === topicId ? null : state.currentTopic,
        }),
        false,
        'topics/deleteTopic'
      ),

    reorderTopics: (items: ReorderItem[]) =>
      set(
        (state: TopicStoreState) => {
          const sortMap = new Map(items.map(item => [item.id, item.sortNumber]))

          return {
            topics: state.topics
              .map(group => {
                const newSortNumber = sortMap.get(Number(group.id))
                return newSortNumber !== undefined ? { ...group, sortNumber: newSortNumber } : group
              })
              .sort((a, b) => a.sortNumber - b.sortNumber),
          }
        },
        false,
        'topics/reorderTopics'
      ),

    setFilters: newFilters =>
      set(
        (state: TopicStoreState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'topics/setFilters'
      ),

    resetFilters: () =>
      set(
        {
          filters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            page: 0,
          },
        },
        false,
        'topics/resetFilters'
      ),

    addQuestion: (topicId, question) =>
      set(
        (state: TopicStoreState) => ({
          topics: state.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  questions: [...(t.questions || []), question],
                }
              : t
          ),
        }),
        false,
        'questions/addQuestion'
      ),

    updateQuestion: (topicId, questionId, newQuestion) =>
      set(
        (state: TopicStoreState) => ({
          topics: state.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  questions: t.questions?.map(q => (q.id === questionId ? newQuestion : q)),
                }
              : t
          ),
        }),
        false,
        'questions/updateQuestion'
      ),

    deleteQuestion: (topicId, questionId) =>
      set(
        (state: TopicStoreState) => ({
          topics: state.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  questions: t.questions?.filter(q => q.id !== questionId),
                }
              : t
          ),
        }),
        false,
        'questions/deleteQuestion'
      ),

    reorderQuestions: (topicId, questions) =>
      set(
        (state: TopicStoreState) => ({
          topics: state.topics.map(t =>
            t.id === topicId
              ? {
                  ...t,
                  questions: questions,
                }
              : t
          ),
        }),
        false,
        'questions/reorderQuestions'
      ),

    getTopicById: id => {
      return get().topics.find((t: FaqTopic) => t.id === id)
    },

    hasTopic: id => {
      return get().topics.some((t: FaqTopic) => t.id === id)
    },
  }),
  'FaqStore'
)
