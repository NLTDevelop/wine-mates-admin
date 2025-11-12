import { useCallback } from 'react'
import { CreateWineAromaGroupParams } from '../entities/types/flavor-types'
import { useWineFlavor } from './useWineFlavors'
import { NewItemData } from '../entities/types/flavor-palette-types'

interface UseFlavorGroupsProps {
  aromaGroups: any[]
  editingGroupData: Record<string, Partial<CreateWineAromaGroupParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
}

export const useFlavorGroups = ({ aromaGroups, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions }: UseFlavorGroupsProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading } = useWineFlavor()

  const handleAddGroup = useCallback(
    async (groupData: Partial<CreateWineAromaGroupParams>) => {
      try {
        await createGroup(groupData as CreateWineAromaGroupParams)
      } catch (error) {
        console.error('Failed to create group:', error)
      }
    },
    [createGroup]
  )

  const startEditingGroup = useCallback(
    (groupId: string) => {
      const group = aromaGroups.find(g => g.id === groupId)
      if (!group) {
        console.error('Group not found:', groupId)
        return
      }

      setOpenAccordions((prev: Set<string>) => {
        const newSet = new Set(prev)
        newSet.add(groupId)
        return newSet
      })

      const groupFormData = {
        nameUa: group.nameUa || '',
        nameEn: group.nameEn || '',
        colorHex: group.colorHex || '',
        sortNumber: group.sortNumber || 0,
        subgroups: group.subgroups || [],
        colors: group.colors || [],
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
    [aromaGroups, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions]
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
        await updateGroup({
          groupId,
          newGroup: groupData as CreateWineAromaGroupParams,
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
    [updateGroup, editingGroupData, setEditingGroup, setEditingGroupData]
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
      return data?.nameUa && data?.nameEn && data?.colorHex
    },
    [editingGroupData]
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
  }
}
