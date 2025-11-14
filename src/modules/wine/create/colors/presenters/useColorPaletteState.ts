import { useState } from 'react'
import { EditingGroupState, NewShadeData } from '../entities/types/color-palette-types'
import { CreateWineColorParams } from '../entities/types/color-types'

export const useColorPaletteState = () => {
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())
  const [editingGroup, setEditingGroup] = useState<EditingGroupState | null>(null)
  const [newItemData, setNewItemData] = useState<Record<string, NewShadeData>>({})
  const [editingGroupData, setEditingGroupData] = useState<Record<string, Partial<CreateWineColorParams>>>({})
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
