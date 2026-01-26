import { useState } from 'react'
import { EditingGroupState, NewItemData } from '../entities/taste-palette-types'
import { CreateWineTasteGroupParams } from '../entities/types/tastes'

export const useTastePaletteState = () => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [editingGroup, setEditingGroup] = useState<EditingGroupState | null>(null)
  const [newItemData, setNewItemData] = useState<Record<string, NewItemData>>({})
  const [editingGroupData, setEditingGroupData] = useState<Record<string, Partial<CreateWineTasteGroupParams>>>({})
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
