import { useCallback } from 'react'

interface UseCharacteristicUIProps {
  openAccordions: Set<string>
  editingCharacteristic: any
  newItemData: Record<string, any>
}

export const UseCharacteristicUI = ({ openAccordions, editingCharacteristic, newItemData }: UseCharacteristicUIProps) => {
  const handleToggleAccordion = useCallback((groupId: string, callbacks: any) => {
    const { setOpenAccordions, setEditingCharacteristic, setNewCharacteristicData, setEditingCharacteristicData } = callbacks

    setOpenAccordions((prev: any) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
        setEditingCharacteristic((current: any) => (current?.characteristicId === groupId ? null : current))
        setNewCharacteristicData((prevData: any) => {
          const newData = { ...prevData }
          delete newData[groupId]
          return newData
        })
        setEditingCharacteristicData((prevData: any) => {
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

  const isFormGroupOpen = useCallback((groupId: string) => editingCharacteristic?.characteristicId === groupId && editingCharacteristic?.isEditingCharacteristic, [editingCharacteristic])

  const isFormItemOpen = useCallback(
    (groupId: string) => !!newItemData[groupId] || (editingCharacteristic?.characteristicId === groupId && !!editingCharacteristic?.editingItem),
    [newItemData, editingCharacteristic]
  )

  const isEditing = useCallback((groupId: string) => editingCharacteristic?.characteristicId === groupId, [editingCharacteristic])

  return {
    handleToggleAccordion,
    isAccordionOpen,
    isFormGroupOpen,
    isFormItemOpen,
    isEditing,
  }
}
