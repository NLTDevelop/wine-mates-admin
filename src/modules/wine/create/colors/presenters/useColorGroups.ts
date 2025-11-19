import { useCallback } from 'react'
import { CreateWineColorParams, WineColorGroup } from '../entities/types/color-types'
import { NewShadeData } from '../entities/types/color-palette-types'
import { useWineColor } from './useWineColors'

interface UseColorGroupsProps {
  colorGroups: WineColorGroup[] | undefined
  editingGroupData: Record<string, Partial<CreateWineColorParams>>
  setEditingGroup: (editingGroup: any) => void
  setEditingGroupData: (data: any) => void
  setForceOpenKeys: (keys: any) => void
  setOpenAccordions: (accordions: any) => void
  setNewItemData: (data: any) => void
}

export const useColorGroups = ({ colorGroups, editingGroupData, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData }: UseColorGroupsProps) => {
  const { createGroup, updateGroup, deleteGroup, isLoading } = useWineColor()

  const handleAddGroup = useCallback(
    async (groupData: Partial<CreateWineColorParams>) => {
      try {
        await createGroup({
          ...(groupData as CreateWineColorParams),
          //   sortNumber: colorGroups?.length || 0
        })
      } catch (error) {
        console.error('Failed to create color group:', error)
      }
    },
    [createGroup, colorGroups]
  )

  const startEditingGroup = useCallback(
    (groupId: string) => {
      const group = colorGroups?.find(g => g.id === groupId)
      if (!group) {
        console.error('Color group not found:', groupId)
        return
      }

      setNewItemData((prev: Record<string, NewShadeData>) => {
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
        // sortNumber: group.sortNumber || 0,
        shades: group.shades || [],
      }

      setEditingGroupData((prev: Record<string, Partial<CreateWineColorParams>>) => ({
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
    [colorGroups, setEditingGroup, setEditingGroupData, setForceOpenKeys, setOpenAccordions, setNewItemData]
  )

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup(groupId)
      } catch (error) {
        console.error('Failed to delete color group:', error)
      }
    },
    [deleteGroup]
  )

  const handleSaveGroup = useCallback(
    async (groupId: string) => {
      const groupData = editingGroupData[groupId]
      if (!groupData) return

      try {
        const currentGroupIndex = colorGroups?.findIndex(g => g.id === groupId) ?? -1
        const groupDataWithSortNumber = {
          ...groupData,
          sortNumber: currentGroupIndex >= 0 ? currentGroupIndex : colorGroups?.length || 0,
        }
        await updateGroup({
          colorId: groupId,
          newColor: groupDataWithSortNumber as CreateWineColorParams,
        })

        setNewItemData((prev: Record<string, NewShadeData>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
        setOpenAccordions((prev: Set<string>) => {
          const newSet = new Set(prev)
          newSet.delete(groupId)
          return newSet
        })
        setEditingGroup(null)
        setEditingGroupData((prev: Record<string, Partial<CreateWineColorParams>>) => {
          const newData = { ...prev }
          delete newData[groupId]
          return newData
        })
      } catch (error) {
        console.error('Failed to update color group:', error)
      }
    },
    [updateGroup, editingGroupData, setEditingGroup, setEditingGroupData, colorGroups]
  )

  const handleCancelGroupEdit = useCallback(
    (groupId: string) => {
      setEditingGroup(null)
      setEditingGroupData((prev: Record<string, Partial<CreateWineColorParams>>) => {
        const newData = { ...prev }
        delete newData[groupId]
        return newData
      })
    },
    [setEditingGroup, setEditingGroupData]
  )

  const updateGroupFormData = useCallback(
    (groupId: string, field: keyof CreateWineColorParams, value: any) => {
      setEditingGroupData((prev: Record<string, Partial<CreateWineColorParams>>) => ({
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
      const group = colorGroups?.find(g => g.id === groupId)
      const currentData = editingGroupData[groupId]

      if (!group || !currentData) return false

      return group.nameUa !== currentData.nameUa || group.nameEn !== currentData.nameEn || group.colorHex !== currentData.colorHex
      //  || group.sortNumber !== currentData.sortNumber
    },
    [colorGroups, editingGroupData]
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
