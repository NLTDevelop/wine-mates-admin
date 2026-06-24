import { useCallback } from 'react'
import { arraysEqual, getDisplayNames } from '@/lib/utils'
import { CreateTopicParams, CreateTopicRequest, FaqTopic } from '../entities/types/types'
import { useQuestion } from './useQuestion'
import { NewItemData } from '../entities/taste-palette-types'

interface UseTopicProps {
  topics: FaqTopic[] | undefined
  editingGroupData: Record<string, Partial<CreateTopicParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
}

export const useTopic = ({ topics, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData }: UseTopicProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading, reorderGroup, isReorderingGroup } = useQuestion()

  const handleAddGroup = useCallback(
    async (groupData: CreateTopicRequest) => {
      try {
        const params: CreateTopicRequest = {
          translations: groupData.translations || [],
        }

        await createGroup(params)
      } catch (error) {
        console.error('Failed to create group:', error)
      }
    },
    [createGroup, topics]
  )

  const startEditingGroup = useCallback(
    (groupId: string) => {
      const group = topics?.find(t => t.id === groupId)
      if (!group) {
        console.error('Group not found:', groupId)
        return
      }

      setNewItemData((prev: Record<string, NewItemData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })

      setOpenAccordions((prev: Set<string>) => {
        const newSet = new Set(prev)
        newSet.add(groupId)
        return newSet
      })
      const groupFormData = {
        translations: group.translations || [],
      }

      setEditingGroupData((prev: Record<string, NewItemData>) => ({
        ...prev,
        [groupId]: groupFormData,
      }))

      setEditingGroup({
        groupId,
        isEditingGroup: true,
      })

      setForceOpenKeys((prev: Record<string, number>) => ({
        ...prev,
        [groupId]: (prev[groupId] || 0) + 1,
      }))
    },
    [topics, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData]
  )

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup(groupId)
      } catch (error) {
        console.error('Failed to delete group:', error)
      }
    },
    [deleteGroup]
  )

  const handleSaveGroup = useCallback(
    async (topicId: string) => {
      const groupData = editingGroupData[topicId]
      if (!groupData) return

      try {
        const newGroupData = {
          ...groupData,
          translations: groupData.translations || [],
        }
        await updateGroup({
          topicId,
          newTopic: newGroupData as CreateTopicRequest,
        })
        setOpenAccordions((prev: Set<string>) => {
          const newSet = new Set(prev)
          newSet.delete(topicId)
          return newSet
        })
        setEditingGroup(null)
        setEditingGroupData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[topicId]
          return newData
        })
      } catch (error) {
        console.error('Failed to update group:', error)
      }
    },
    [updateGroup, editingGroupData, setEditingGroup, setEditingGroupData, topics]
  )

  const handleCancelGroupEdit = useCallback(
    (groupId: string) => {
      setEditingGroup(null)
      setEditingGroupData((prev: Record<string, NewItemData>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })
    },
    [setEditingGroup, setEditingGroupData]
  )

  const updateGroupFormData = useCallback(
    (groupId: string, field: keyof CreateTopicParams, value: any) => {
      setEditingGroupData((prev: Record<string, NewItemData>) => ({
        ...prev,
        [groupId]: {
          ...prev[groupId],
          [field]: value,
        },
      }))
    },
    [setEditingGroupData]
  )

  const canSaveGroup = useCallback(
    (groupId: string) => {
      const data = editingGroupData[groupId]
      if (!data?.translations) return false

      const { nameUa, nameEn } = getDisplayNames(data.translations)
      return nameUa && nameEn
    },
    [editingGroupData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const group = topics?.find(t => t.id === groupId)
      const currentData = editingGroupData[groupId]

      if (!group || !currentData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNames(group.translations)

      const namesChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn
      const translationsChanged = !arraysEqual(group.translations || [], currentData.translations || [], (a, b) => a.language === b.language && a.name === b.name)

      return namesChanged || translationsChanged
    },
    [topics, editingGroupData]
  )

  return {
    handleAddGroup,
    startEditingGroup,
    handleDeleteGroup,
    handleSaveGroup,
    handleCancelGroupEdit,
    updateGroupFormData,
    canSaveGroup,
    isLoading,
    hasChanges,
    reorderGroup,
    isReorderingGroup,
  }
}
