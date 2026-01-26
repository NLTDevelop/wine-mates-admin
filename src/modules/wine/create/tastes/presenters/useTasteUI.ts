import { useCallback } from 'react'

interface UseTasteUIProps {
  openAccordions: Set<string>
  editingGroup: any
  newItemData: Record<string, any>
}

export const useTasteUI = ({ openAccordions, editingGroup, newItemData }: UseTasteUIProps) => {
  const handleToggleAccordion = useCallback((groupId: string, callbacks: any) => {
    const { setOpenAccordions, setEditingGroup, setNewItemData, setEditingGroupData } = callbacks

    setOpenAccordions((prev: any) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
        setEditingGroup((current: any) => (current?.groupId === groupId ? null : current))
        setNewItemData((prevData: any) => {
          const newData = { ...prevData }
          delete newData[groupId]
          return newData
        })
        setEditingGroupData((prevData: any) => {
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

  const isFormGroupOpen = useCallback((groupId: string) => editingGroup?.groupId === groupId && editingGroup?.isEditingGroup, [editingGroup])

  const isFormItemOpen = useCallback((groupId: string) => !!newItemData[groupId] || (editingGroup?.groupId === groupId && !!editingGroup?.editingItem), [newItemData, editingGroup])

  const isEditing = useCallback((groupId: string) => editingGroup?.groupId === groupId, [editingGroup])

  return {
    handleToggleAccordion,
    isAccordionOpen,
    isFormGroupOpen,
    isFormItemOpen,
    isEditing,
  }
}
