import { useState, useCallback, MouseEvent, KeyboardEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wineFlavorQueries } from '../entities/wine-flavor-queries'
import { WineAromaItem } from '../entities/types/flavor'

interface UseFlavorItemProps {
  data: WineAromaItem
  groupId: string
  isEditable?: boolean
}

export const useFlavorItem = ({ data, groupId, isEditable = false }: UseFlavorItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.name)
  const queryClient = useQueryClient()

  const updateItemMutation = useMutation({
    ...wineFlavorQueries.updateItem(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aroma-groups', groupId, 'items'] })
    },
  })

  const handleSaveLabel = useCallback(
    async (e?: MouseEvent | KeyboardEvent) => {
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      if (!data.id) return

      await updateItemMutation.mutateAsync({
        groupId,
        itemId: data.id,
        newItem: {
          name: editValue,
          nameEn: data.nameEn || editValue,
        },
      })

      setIsEditing(false)
    },
    [data, editValue, groupId, updateItemMutation]
  )
}
