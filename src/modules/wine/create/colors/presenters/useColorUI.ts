import { useCallback } from 'react'
import { NewShadeData } from '../entities/types/color-palette-types'
import { CreateWineColorParams } from '../entities/types/color-types'

interface UseColorUIProps {
  openAccordions: Set<string>
  editingGroup: any
  newItemData: Record<string, any>
}

export const useColorUI = ({ openAccordions, editingGroup, newItemData }: UseColorUIProps) => {
  const handleToggleAccordion = useCallback((groupId: string, callbacks: any) => {
    const { setOpenAccordions, setEditingGroup, setNewItemData, setEditingGroupData } = callbacks

    setOpenAccordions((prev: Set<string>) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
        setEditingGroup((current: any) => (current?.groupId === groupId ? null : current))
        setNewItemData((prevData: Record<string, NewShadeData>) => {
          const newData = { ...prevData }
          delete newData[groupId]
          return newData
        })
        setEditingGroupData((prevData: Record<string, Partial<CreateWineColorParams>>) => {
          const newData = { ...prevData }
          delete newData[groupId]
          return newData
        })
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }, [])

  const isAccordionOpen = useCallback((groupId: string) => openAccordions.has(groupId), [openAccordions])

  const isFormGroupOpen = useCallback((groupId: string) => editingGroup?.groupId === groupId && editingGroup.isEditingGroup, [editingGroup])

  const isFormItemOpen = useCallback((groupId: string) => !!newItemData[groupId] || (editingGroup?.groupId === groupId && !!editingGroup.editingItem), [newItemData, editingGroup])

  const isEditing = useCallback((groupId: string) => editingGroup?.groupId === groupId, [editingGroup])

  return {
    handleToggleAccordion,
    isAccordionOpen,
    isFormGroupOpen,
    isFormItemOpen,
    isEditing,
  }
}
