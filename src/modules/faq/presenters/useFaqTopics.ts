import { useCallback } from 'react'
import { arraysEqual } from '@/lib/utils'
import { TopicCreate, TopicRequest, TopicUpdate } from '../enteties/types'
import { useFaq } from './useFaq'

interface UseFaqTopicsProps {
  topics: TopicRequest | undefined
  editingTopicData: Record<string, Partial<TopicUpdate>>
  setEditingTopic: (editingTopic: any) => void
  setEditingTopicData: (data: any) => void
  setNewItemData: (data: any) => void
}

export const useFaqTopics = ({ topics, editingTopicData, setEditingTopic, setEditingTopicData, setNewItemData }: UseFaqTopicsProps) => {
  const { createTopic, updateTopic, deleteTopic, isLoading } = useFaq()

  const handleAddTopic = useCallback(
    async (topicData: Partial<TopicCreate>) => {
      try {
        await createTopic({
          ...(topicData as TopicCreate),
        })
      } catch (error) {
        console.error('Failed to create topic:', error)
      }
    },
    [createTopic, topics]
  )

  const startEditingTopic = useCallback(
    (topicId: number) => {
      const topic = topics?.find(t => t.id === topicId)
      if (!topic) {
        console.error('Topic not found:', topicId)
        return
      }

      setNewItemData((prev: Record<string, TopicUpdate>) => {
        const newData = { ...prev }
        delete newData[topicId]
        return newData
      })

      const topicFormData = {
        topicName: topic.topicName || '',
        questions: topic.questions || [],
      }

      setEditingTopicData((prev: Record<string, Partial<TopicCreate>>) => ({
        ...prev,
        [topicId]: topicFormData,
      }))

      setEditingTopic({ topicId, isEditingTopic: true })
    },
    [topics, setEditingTopic, setEditingTopicData, setNewItemData]
  )

  const handleDeleteTopic = useCallback(
    async (topicId: number) => {
      try {
        await deleteTopic(topicId)
      } catch (error) {
        console.error('Failed to delete color group:', error)
      }
    },
    [deleteTopic]
  )

  const handleSaveTopic = useCallback(
    async (topicId: number) => {
      const topicData = editingTopicData[topicId]
      if (!topicData) return

      try {
        const currentTopicIndex = topics?.findIndex(t => t.id === topicId) ?? -1
        const topicDataWithSortNumber = {
          ...topicData,
          sortNumber: currentTopicIndex >= 0 ? currentTopicIndex : topics?.length || 0,
        }
        await updateTopic({
          topicId: topicId,
          newTopic: topicDataWithSortNumber as TopicCreate,
        })

        setNewItemData((prev: Record<string, TopicCreate>) => {
          const newData = { ...prev }
          delete newData[topicId]
          return newData
        })

        setEditingTopic(null)
        setEditingTopicData((prev: Record<string, Partial<TopicCreate>>) => {
          const newData = { ...prev }
          delete newData[topicId]
          return newData
        })
      } catch (error) {
        console.error('Failed to update color group:', error)
      }
    },
    [updateTopic, editingTopicData, setEditingTopic, setEditingTopicData, topics]
  )

  const handleCancelGroupEdit = useCallback(
    (topicId: number) => {
      setEditingTopic(null)
      setEditingTopicData((prev: Record<string, Partial<TopicCreate>>) => {
        const newData = { ...prev }
        delete newData[topicId]
        return newData
      })
    },
    [setEditingTopic, setEditingTopicData]
  )

  const updateTopicFormData = useCallback(
    (topicId: number, field: keyof TopicCreate, value: any) => {
      setEditingTopicData((prev: Record<string, Partial<TopicCreate>>) => ({
        ...prev,
        [topicId]: {
          ...prev[topicId],
          [field]: value,
        },
      }))
    },
    [setEditingTopicData]
  )

  const canSaveTopic = useCallback(
    (topicId: number) => {
      const data = editingTopicData[topicId]
      if (!data?.topicName) return false

      return data?.topicName
    },
    [editingTopicData]
  )

  const hasChanges = useCallback(
    (topicId: number) => {
      const group = topics?.find(t => t.id === topicId)
      const currentData = editingTopicData[topicId]

      if (!group || !currentData) return false

      const namesChanged = group.topicName !== currentData.topicName
      const guestionChanged = !arraysEqual(group.questions || [], currentData.questions || [])

      return namesChanged || guestionChanged 
    },
    [topics, editingTopicData]
  )

  return {
    handleAddTopic,
    startEditingTopic,
    handleDeleteTopic,
    handleSaveTopic,
    handleCancelGroupEdit,
    updateTopicFormData,
    canSaveTopic,
    isLoading,
    hasChanges,
  }
}
