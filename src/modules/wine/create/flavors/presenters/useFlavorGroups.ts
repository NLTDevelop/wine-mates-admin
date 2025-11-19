import { useCallback } from 'react'
import { CreateWineAromaGroupParams, CreateWineAromaGroupRequest, WineAromaGroup } from '../entities/types/flavor-types'
import { useWineFlavor } from './useWineFlavors'
import { NewItemData } from '../entities/types/flavor-palette-types'
import { BaseWineColor } from '../../general/entities/types'

interface UseFlavorGroupsProps {
  aromaGroups: WineAromaGroup[] | undefined
  editingGroupData: Record<string, Partial<CreateWineAromaGroupParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
  cachedColors: BaseWineColor[]
}

export const useFlavorGroups = ({ aromaGroups, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData, cachedColors }: UseFlavorGroupsProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading } = useWineFlavor(cachedColors)

  const handleAddGroup = useCallback(
    async (groupData: Partial<CreateWineAromaGroupParams>) => {
      try {
        const params: CreateWineAromaGroupParams = {
          nameUa: groupData.nameUa || '',
          nameEn: groupData.nameEn || '',
          colorHex: groupData.colorHex || '',
          colors: groupData.colors || [],
          sortNumber: aromaGroups?.length || 0,
          subgroups: [],
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
        const currentGroupIndex = aromaGroups?.findIndex(g => g.id === groupId) ?? -1
        const newGroupData = {
          ...groupData,
          colorIds: groupData.colors?.map(color => color.id) || [],
          sortNumber: currentGroupIndex >= 0 ? currentGroupIndex : aromaGroups?.length || 0,
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
      return data?.nameUa && data?.nameEn && data?.colorHex
    },
    [editingGroupData]
  )

  const hasChanges = useCallback(
    (groupId: string) => {
      const group = aromaGroups?.find(g => g.id === groupId)
      const currentData = editingGroupData[groupId]

      if (!group || !currentData) return false

      return (
        group.nameUa !== currentData.nameUa ||
        group.nameEn !== currentData.nameEn ||
        group.colorHex !== currentData.colorHex ||
        group.sortNumber !== currentData.sortNumber ||
        JSON.stringify(group.colors?.map(c => c.id)) !== JSON.stringify(currentData.colors?.map(c => c.id))
      )
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
  }
}
