import { useState } from 'react'
import { EditingTopicState, NewItemData } from '../entities/taste-palette-types'
import { CreateTopicParams } from '../entities/types/types'

export const useTopicPaletteState = () => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [editingGroup, setEditingGroup] = useState<EditingTopicState | null>(null)
  const [newItemData, setNewItemData] = useState<Record<string, NewItemData>>({})
  const [editingGroupData, setEditingGroupData] = useState<Record<string, Partial<CreateTopicParams>>>({})
  const [forceOpenKeys, setForceOpenKeys] = useState<Record<string, number>>({})

  return {
    state: {
      openAccordions,
      editingGroup,
      newItemData,
      editingGroupData,
      forceOpenKeys,
    },
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    setForceOpenKeys,
  }
}
