import { useState } from 'react'
import { EditingGroupState, NewItemData } from '../entities/types/flavor-palette-types'
import { CreateWineAromaGroupParams } from '../entities/types/flavor-types'

export const useFlavorPaletteState = () => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [editingGroup, setEditingGroup] = useState<EditingGroupState | null>(null)
  const [newItemData, setNewItemData] = useState<Record<string, NewItemData>>({})
  const [editingGroupData, setEditingGroupData] = useState<Record<string, Partial<CreateWineAromaGroupParams>>>({})
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
