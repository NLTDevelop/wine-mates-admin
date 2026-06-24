import { useCallback } from 'react'
import { useWineFlavor } from './useWineFlavors'
import { CreateWineAromaGroupParams, CreateWineAromaGroupRequest, WineAromaGroup } from '../entities/types/flavor-types'
import { NewItemData } from '../entities/types/flavor-palette-types'
import { arraysEqual, getDisplayNames } from '@/lib/utils'

interface UseFlavorGroupsProps {
  aromaGroups: WineAromaGroup[] | undefined
  editingGroupData: Record<string, Partial<CreateWineAromaGroupParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
}

export const useFlavorGroups = ({ aromaGroups, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData }: UseFlavorGroupsProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading, reorderGroup, isReorderingGroup } = useWineFlavor()

  const handleAddGroup = useCallback(
    async (groupData: CreateWineAromaGroupRequest) => {
      try {
        const params: CreateWineAromaGroupRequest = {
          translations: groupData.translations || [],
          colorHex: groupData.colorHex || '',
        }

        await createGroup(params)
      } catch (error) {
        console.error('Failed to create group:', error)
      }
    },
    [createGroup, aromaGroups]
  )

  const startEditingGroup = useCallback(
    (groupId: string) => {
      const group = aromaGroups?.find(g => g.id === groupId)
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
        subgroups: group.subgroups || [],
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
    [aromaGroups, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData]
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
          newGroup: newGroupData as CreateWineAromaGroupRequest,
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
    [updateGroup, editingGroupData, setEditingGroup, setEditingGroupData, aromaGroups]
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
    (groupId: string, field: keyof CreateWineAromaGroupParams, value: any) => {
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
      const group = aromaGroups?.find(g => g.id === groupId)
      const currentData = editingGroupData[groupId]

      if (!group || !currentData) return false

      const { nameUa: currentNameUa, nameEn: currentNameEn } = getDisplayNames(currentData.translations || [])
      const { nameUa: originalNameUa, nameEn: originalNameEn } = getDisplayNames(group.translations)

      const namesChanged = originalNameUa !== currentNameUa || originalNameEn !== currentNameEn
      const colorHexChanged = group.colorHex !== currentData.colorHex
      const translationsChanged = !arraysEqual(group.translations || [], currentData.translations || [], (a, b) => a.language === b.language && a.name === b.name)

      return namesChanged || colorHexChanged || translationsChanged
    },
    [aromaGroups, editingGroupData]
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
