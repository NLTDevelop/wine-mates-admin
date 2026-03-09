import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IQuestion, ITopic, TopicRequest } from './types'
import { mockTopics } from '../presenters/mock'

type PartialTopic = Partial<ITopic>
type EditingState = { topicId: number; isEditingTopic: boolean } | null

interface ITempQuestion extends Omit<IQuestion, 'id'> {
  id: string
}

interface FaqState {
  topics: TopicRequest
  reorderedQuestions: IQuestion[]
  editingTopicData: Record<number, PartialTopic>
  editingTopic: EditingState
  newItemData: Record<number, PartialTopic>

  currentQuestions: ITempQuestion[]
  currentTopicId: number | null
  isCreatingNew: boolean

  setTopics: (topics: TopicRequest) => void
  updateTopicsOrder: (reorderedTopics: TopicRequest) => void
  updateQuestionsOrder: (topicId: number, reorderedQuestions: IQuestion[]) => void
  updateCurrentQuestionsOrder: (reorderedQuestions: ITempQuestion[]) => void
  addTopic: (topic: TopicRequest[number]) => void
  updateTopic: (id: number, updatedTopic: Partial<TopicRequest[number]>) => void
  deleteTopic: (id: number) => void
  setEditingTopic: (editingTopic: EditingState) => void
  setEditingTopicData: (data: Record<number, PartialTopic> | ((prev: Record<number, PartialTopic>) => Record<number, PartialTopic>)) => void
  setNewItemData: (data: Record<number, PartialTopic> | ((prev: Record<number, PartialTopic>) => Record<number, PartialTopic>)) => void

  setCurrentQuestions: (questions: ITempQuestion[]) => void
  setCurrentTopicId: (topicId: number | null) => void
  setIsCreatingNew: (isCreating: boolean) => void

  updateQuestion: (questionId: string, field: 'question' | 'answer', value: string) => void
  addQuestion: () => void
  removeQuestion: (questionId: string) => void

  initializeQuestionsFromTopic: (topicId: number) => void
  initializeEmptyQuestions: () => void
  resetCurrentQuestions: () => void

  getFormattedQuestions: () => IQuestion[]
}

export const useFaqStore = createStoreDevToolsWrapper<FaqState>((set, get) => ({
  topics: mockTopics,
  reorderedQuestions: [],
  editingTopicData: {},
  editingTopic: null,
  newItemData: {},

  currentQuestions: [],
  currentTopicId: null,
  isCreatingNew: false,

  setTopics: topics => set({ topics }),

  updateTopicsOrder: reorderedTopics => set({ topics: reorderedTopics }),

  updateQuestionsOrder: (topicId, reorderedQuestions) =>
    set((state: FaqState) => ({
      topics: state.topics.map(topic => (topic.id === topicId ? { ...topic, questions: reorderedQuestions } : topic)),
    })),

   updateCurrentQuestionsOrder: (reorderedQuestions) =>
    set(() => ({
      currentQuestions: reorderedQuestions
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

  setEditingTopic: editingTopic => set({ editingTopic }),

  setEditingTopicData: data =>
    set((state: FaqState) => ({
      editingTopicData: typeof data === 'function' ? (data as Function)(state.editingTopicData) : data,
    })),

  setNewItemData: data =>
    set((state: FaqState) => ({
      newItemData: typeof data === 'function' ? (data as Function)(state.newItemData) : data,
    })),

  setCurrentQuestions: questions => set({ currentQuestions: questions }),

  setCurrentTopicId: topicId => set({ currentTopicId: topicId }),

  setIsCreatingNew: isCreating => set({ isCreatingNew: isCreating }),

  updateQuestion: (questionId, field, value) =>
    set((state: FaqState) => ({
      currentQuestions: state.currentQuestions.map(q => (q.id === questionId ? { ...q, [field]: value } : q)),
    })),

  addQuestion: () =>
    set((state: FaqState) => {
      if (state.currentQuestions.length === 0) {
        const newQuestion = { id: crypto.randomUUID(), question: '', answer: '' }
        return {
          ...state,
          currentQuestions: [newQuestion],
        }
      }

      const lastQuestion = state.currentQuestions[state.currentQuestions.length - 1]
      const isLastQuestionFilled = lastQuestion?.question?.trim().length > 0

      if (!isLastQuestionFilled) {
        return state
      }

      const newQuestion = { id: crypto.randomUUID(), question: '', answer: '' }

      return {
        ...state,
        currentQuestions: [...state.currentQuestions, newQuestion],
      }
    }),

  removeQuestion: questionId =>
    set((state: FaqState) => {
      if (state.currentQuestions.length <= 1) {
        return { currentQuestions: [] }
      }
      return {
        currentQuestions: state.currentQuestions.filter(q => q.id !== questionId),
      }
    }),

  initializeQuestionsFromTopic: topicId =>
    set((state: FaqState) => {
      const topic = state.topics.find(t => t.id === topicId)
      if (!topic) return { currentQuestions: [], currentTopicId: topicId }

      const questions =
        topic.questions?.map(q => ({
          id: crypto.randomUUID(),
          question: q.question || '',
          answer: q.answer || '',
        })) || []

      return {
        currentQuestions: questions.length > 0 ? questions : [{ id: crypto.randomUUID(), question: '', answer: '' }],
        currentTopicId: topicId,
        isCreatingNew: false,
      }
    }),

  initializeEmptyQuestions: () =>
    set({
      currentQuestions: [{ id: crypto.randomUUID(), question: '', answer: '' }],
      currentTopicId: null,
      isCreatingNew: true,
    }),

  resetCurrentQuestions: () =>
    set({
      currentQuestions: [],
      currentTopicId: null,
      isCreatingNew: false,
    }),

  getFormattedQuestions: () => {
    const { currentQuestions } = get()
    return currentQuestions
      .filter((q: IQuestion) => q.question && q.question.trim() !== '')
      .map((q: IQuestion, idx: number) => ({
        id: idx + 1,
        question: q.question,
        answer: q.answer || undefined,
        sortNumber: idx,
      }))
  },
}))
