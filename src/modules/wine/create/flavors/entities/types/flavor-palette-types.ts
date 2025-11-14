import { Dispatch, SetStateAction } from 'react'
import { CreateWineAromaGroupParams, WineAromaItem, WineAromaSubgroup } from './flavor-types'

export interface EditingGroupState {
  groupId: string
  editingItem?: WineAromaSubgroup
  isEditingGroup: boolean
}

export interface NewItemData {
  name: string
  nameEn: string
  aromas?: WineAromaItem[] | null
}

export interface ToggleCallbacks {
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingGroupState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateWineAromaGroupParams>>>>
}

export type FlavorPaletteHookReturn = {
  aromaGroups: any[]
  isLoading: boolean
  isCreatingGroup: boolean
  openAccordions: Set<string>
  editingGroup: EditingGroupState | null
  newItemData: Record<string, NewItemData>
  editingGroupData: Record<string, Partial<CreateWineAromaGroupParams>>
  forceOpenKeys: Record<string, number>
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingGroup: Dispatch<SetStateAction<EditingGroupState | null>>
  setNewItemData: Dispatch<SetStateAction<Record<string, NewItemData>>>
  setEditingGroupData: Dispatch<SetStateAction<Record<string, Partial<CreateWineAromaGroupParams>>>>
  groups: any
  items: any
  ui: any
}
