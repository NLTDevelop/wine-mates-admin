import { Dispatch, SetStateAction } from 'react'
import { CreateWineTasteGroupParams, WineTasteItem } from './types/tastes'
import { NameDictionary } from '../../general/entities/types'

export interface EditingGroupState {
  groupId: string
  editingItem?: WineTasteItem
  isEditingGroup: boolean
}

export interface NewItemData {
  translations: NameDictionary[]
  colorHex: string
}

export interface ToggleCallbacks {
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingGroupState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateWineTasteGroupParams>>>>
}

export type FlavorPaletteHookReturn = {
  tasteGroups: any[]
  isLoading: boolean
  isCreatingGroup: boolean
  openAccordions: Set<string>
  editingGroup: EditingGroupState | null
  newItemData: Record<string, NewItemData>
  editingGroupData: Record<string, Partial<CreateWineTasteGroupParams>>
  forceOpenKeys: Record<string, number>
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingGroupState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateWineTasteGroupParams>>>>
  groups: any
  ui: any
}
