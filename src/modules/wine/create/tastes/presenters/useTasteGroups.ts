import { useCallback } from 'react'
import { arraysEqual, getDisplayNames } from '@/lib/utils'
import { CreateWineTasteGroupParams, CreateWineTasteGroupRequest, WineTasteGroup } from '../entities/types/tastes'
import { useWineTaste } from './useWineTaste'
import { NewItemData } from '../entities/taste-palette-types'

interface UseFlavorGroupsProps {
  tasteGroups: WineTasteGroup[] | undefined
  editingGroupData: Record<string, Partial<CreateWineTasteGroupParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
}

export const useTasteGroups = ({ tasteGroups, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData }: UseFlavorGroupsProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading, reorderGroup, isReorderingGroup } = useWineTaste()

  const handleAddGroup = useCallback(
    async (groupData: CreateWineTasteGroupRequest) => {
      try {
        const params: CreateWineTasteGroupRequest = {
          translations: groupData.translations || [],
          colorHex: groupData.colorHex || '',
        }

        await createGroup(params)
      } catch (error) {
        console.error('Failed to create group:', error)
      }
    },
    [createGroup, tasteGroups]
  )

  const startEditingGroup = useCallback(
    (groupId: string) => {
      const group = tasteGroups?.find(t => t.id === groupId)
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
        colorHex: group.colorHex || '',
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
    [tasteGroups, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData]
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
    async (groupId: string) => {
      const groupData = editingGroupData[groupId]
      if (!groupData) return

      try {
        const newGroupData = {
          ...groupData,
          translations: groupData.translations || [],
        }
        await updateGroup({
          groupId,
          newGroup: newGroupData as CreateWineTasteGroupRequest,
        })
        setOpenAccordions((prev: Set<string>) => {
          const newSet = new Set(prev)
          newSet.delete(groupId)
          return newSet
        })
        setEditingGroup(null)
        setEditingGroupData((prev: Record<string, NewItemData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
      } catch (error) {
        console.error('Failed to update group:', error)
      }
    },
    [updateGroup, editingGroupData, setEditingGroup, setEditingGroupData, tasteGroups]
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
    (groupId: string, field: keyof CreateWineTasteGroupParams, value: any) => {
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
      return nameUa && nameEn && data?.colorHex
    },
    [editingGroupData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const group = tasteGroups?.find(t => t.id === groupId)
      const currentData = editingGroupData[groupId]

      if (!group || !currentData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNames(group.translations)

      const namesChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn
      const colorHexChanged = group.colorHex !== currentData.colorHex
      const translationsChanged = !arraysEqual(group.translations || [], currentData.translations || [], (a, b) => a.language === b.language && a.name === b.name)

      return namesChanged || colorHexChanged || translationsChanged
    },
    [tasteGroups, editingGroupData]
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
