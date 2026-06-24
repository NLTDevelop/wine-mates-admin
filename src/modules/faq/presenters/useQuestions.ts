import { useCallback } from 'react'
import { createTranslations, getDisplayNames } from '@/lib/utils'
import { AnswerDictionary, CreateQuestionData, CreateQuestionParams, FaqQuestion, FaqTopic, QuestionDictionary } from '../entities/types/types'
import { useQuestion } from './useQuestion'
import { EditingTopicState, NewItemData } from '../entities/taste-palette-types'
import { useFaqStore } from '../entities/wine-taste-store'
import { NameDictionary } from '@/modules/wine/create/general/entities/types'

interface UseQuestionsProps {
  topics: FaqTopic[] | undefined
  editingGroup: any
  newItemData: Record<string, any>
  openAccordions: Set<string>
  setEditingGroup: (editingGroup: any) => void
  setNewItemData: (data: any) => void
  setOpenAccordions: (accordions: any) => void
}

export const useQuestions = ({ topics, editingGroup, newItemData, openAccordions, setEditingGroup, setNewItemData, setOpenAccordions }: UseQuestionsProps) => {
  const { createQuestion, updateQuestion, deleteQuestion, reorderQuestion } = useQuestion()

  const store = useFaqStore()

  const handleAddAromaClick = useCallback(
    (groupId: string) => {
      if (newItemData[groupId]) {
        setNewItemData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
      } else {
        setNewItemData((prev: Record<string, NewItemData>) => ({
          ...prev,
          [groupId]: { questionTranslations: createTranslations('', ''), answerTranslations: createTranslations('', '') },
        }))
        if (editingGroup?.groupId === groupId && editingGroup.isEditingGroup) {
          setEditingGroup(null)
        }
      }
    },
    [editingGroup, newItemData, setEditingGroup, setNewItemData]
  )

  const handleEditItem = useCallback(
    (groupId: string, item?: FaqQuestion) => {
      if (!item) return

      const questionTranslationsUI = (item.questionTranslations || []).map(qt => ({
        id: qt.id,
        language: qt.language,
        name: qt.question || qt.name,
      }))

      const answerTranslationsUI = (item.answerTranslations || []).map(at => ({
        id: at.id,
        language: at.language,
        name: at.answer || at.name,
      }))

      setEditingGroup({
        groupId,
        editingItem: item,
        isEditingGroup: false,
      })

      setNewItemData((prev: Record<string, NewItemData>) => ({
        ...prev,
        [groupId]: {
          questionTranslations: questionTranslationsUI,
          answerTranslations: answerTranslationsUI,
        },
      }))

      if (!openAccordions.has(groupId)) {
        setOpenAccordions((prev: Set<string>) => new Set(prev).add(groupId))
      }
    },
    [openAccordions, setEditingGroup, setNewItemData, setOpenAccordions]
  )

  const onRemoveItem = useCallback(
    async (topicId: string, questionId: string) => {
      try {
        const isEditingCurrentItem = editingGroup?.groupId === topicId && editingGroup?.editingItem?.id === questionId

        await deleteQuestion({ topicId, questionId })

        if (isEditingCurrentItem) {
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[topicId]
            return newData
          })
        }
      } catch (error) {
        console.error('Failed to delete shade:', error)
      }
    },
    [deleteQuestion, editingGroup, setEditingGroup, setNewItemData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const editingItem = editingGroup?.editingItem
      const currentData = newItemData[groupId]

      if (!editingItem) {
        const questionNames = getDisplayNames(currentData?.questionTranslations || [])
        const answerNames = getDisplayNames(currentData?.answerTranslations || [])

        const hasFormChanges = !!(questionNames.nameUa && questionNames.nameEn && answerNames.nameUa && answerNames.nameEn)
        return hasFormChanges
      }

      if (!currentData) return false

      const currentQuestionNames = getDisplayNames(currentData.questionTranslations || [])
      const editingQuestionNames = getDisplayNames(editingItem.questionTranslations || [])

      const currentAnswerNames = getDisplayNames(currentData.answerTranslations || [])
      const editingAnswerNames = getDisplayNames(editingItem.answerTranslations || [])

      const questionChanged = editingQuestionNames.nameUa !== currentQuestionNames.nameUa || editingQuestionNames.nameEn !== currentQuestionNames.nameEn

      const answerChanged = editingAnswerNames.nameUa !== currentAnswerNames.nameUa || editingAnswerNames.nameEn !== currentAnswerNames.nameEn

      return questionChanged || answerChanged
    },
    [editingGroup, newItemData]
  )

  const handleSaveItem = useCallback(
    async (groupId: string) => {
      const isNewItem = !editingGroup?.editingItem

      if (!isNewItem && !hasChanges(groupId)) {
        setEditingGroup(null)
        setNewItemData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
        return
      }

      if (editingGroup?.editingItem && editingGroup.groupId === groupId) {
        const existingQuestionTranslations = editingGroup.editingItem.questionTranslations || []
        const existingAnswerTranslations = editingGroup.editingItem.answerTranslations || []
        const translations = [
          ...(newItemData[groupId]?.questionTranslations || []).map((qt: QuestionDictionary, idx: number) => ({
            id: existingQuestionTranslations[idx]?.id,
            language: qt.language,
            question: qt.name,
          })),
          ...(newItemData[groupId]?.answerTranslations || []).map((at: AnswerDictionary, idx: number) => ({
            id: existingAnswerTranslations[idx]?.id,
            language: at.language,
            answer: at.name,
          })),
        ]

        const questionData: CreateQuestionParams = {
          topicId: groupId,
          translations,
          sortNumber: editingGroup.editingItem.sortNumber,
        }

        try {
          await updateQuestion({
            topicId: editingGroup.editingItem.id,
            newQuestion: questionData,
          })
          setEditingGroup(null)
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to update question:', error)
        }
      } else if (newItemData[groupId]) {
        const questionData: CreateQuestionData = {
          questionTranslations: newItemData[groupId].questionTranslations,
          answerTranslations: newItemData[groupId].answerTranslations,
        }

        try {
          await createQuestion({ topicId: groupId, questionData })
          setNewItemData((prev: Record<string, NewItemData>) => {
            const newData = { ...prev }
            delete newData[groupId]
            return newData
          })
        } catch (error) {
          console.error('Failed to create question:', error)
        }
      }
    },
    [editingGroup, newItemData, updateQuestion, createQuestion, setEditingGroup, setNewItemData, hasChanges]
  )

  const handleCancelItemEdit = useCallback(
    (groupId: string) => {
      setEditingGroup((prev: EditingTopicState | null) => {
        if (prev?.groupId === groupId) {
          return null
        }
        return prev
      })

      setNewItemData((prev: Record<string, NewItemData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })
    },
    [setEditingGroup, setNewItemData]
  )

  const updateItemFormData = useCallback(
    (groupId: string, field: 'questionTranslations' | 'answerTranslations', value: string | NameDictionary[]) => {
      setNewItemData((prev: Record<string, NewItemData>) => {
        const newData = {
          ...prev,
          [groupId]: {
            ...prev[groupId],
            [field]: value,
          },
        }
        return newData
      })
    },
    [setNewItemData]
  )

  const canAddItem = useCallback(
    (groupId: string) => {
      const data = newItemData[groupId]
      if (!data) return false

      const questionNames = getDisplayNames(data.questionTranslations || [])
      const answerNames = getDisplayNames(data.answerTranslations || [])

      const hasRequiredFields = !!(questionNames.nameUa?.trim() && questionNames.nameEn?.trim() && answerNames.nameUa?.trim() && answerNames.nameEn?.trim())

      if (!hasRequiredFields) {
        return false
      }

      const isEditingItem = editingGroup?.groupId === groupId && editingGroup?.editingItem
      if (isEditingItem) {
        return hasChanges(groupId)
      }

      return true
    },
    [newItemData, editingGroup, hasChanges]
  )

  const getQuestionText = useCallback((item: FaqQuestion) => {
    const { nameUa: questionText } = getDisplayNames(item.questionTranslations || [], 'question')
    return questionText || ''
  }, [])

  const getAnswerText = useCallback((item: FaqQuestion) => {
    const { nameUa: answerText } = getDisplayNames(item.answerTranslations || [], 'answer')
    return answerText || ''
  }, [])

  const handleReorderQuestion = useCallback(
    async (groupId: string, reorderedQuestion: FaqQuestion[]) => {
      store.reorderQuestions(groupId, reorderedQuestion)
      const reorderParams = reorderedQuestion.map((q, index) => ({
        id: Number(q.id),
        sortNumber: index,
      }))

      await reorderQuestion(reorderParams)
    },
    [reorderQuestion]
  )

  const getQuestionForGroup = useCallback(
    (groupId: string) => {
      const group = topics?.find(t => t.id === groupId)

      return group?.questions || []
    },
    [topics]
  )

  return {
    handleAddAromaClick,
    handleEditItem,
    onRemoveItem,
    handleSaveItem,
    handleCancelItemEdit,
    updateItemFormData,
    canAddItem,
    getAnswerText,
    getQuestionText,

    handleReorderQuestion,
    getQuestionForGroup,

    hasChanges,
  }
}
