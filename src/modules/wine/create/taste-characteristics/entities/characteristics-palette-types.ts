import { Dispatch, SetStateAction } from 'react'
import { NameDescriptionDictionary } from '../../general/entities/types'
import { CreateWineTasteCharacteristicParams, LevelItem } from './taste-characteristics'

export interface EditingCharacteristicState {
  characteristicId: string
  isEditingCharacteristic: boolean
}

export interface NewCharacteristicData {
  translations: NameDescriptionDictionary[][]
  levels: LevelItem[]
  colorHex: string
  description?: string
}

export interface ToggleCallbacks {
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingCharacteristic: Dispatch<SetStateAction<EditingCharacteristicState | null>>
  setNewCharacteristicData: Dispatch<SetStateAction<Record<string, NewCharacteristicData>>>
  setEditingCharacteristicData: Dispatch<SetStateAction<Record<string, Partial<CreateWineTasteCharacteristicParams>>>>
}

export type CharacteristicPaletteHookReturn = {
  tasteCharacteristics: any[]
  isLoading: boolean
  isCreating: boolean
  openAccordions: Set<string>
  editingCharacteristic: EditingCharacteristicState | null
  newCharacteristicData: Record<string, NewCharacteristicData>
  editingCharacteristicData: Record<string, Partial<CreateWineTasteCharacteristicParams>>
  forceOpenKeys: Record<string, number>
  setOpenAccordions: Dispatch<SetStateAction<Set<string>>>
  setEditingCharacteristic: Dispatch<SetStateAction<EditingCharacteristicState | null>>
  setNewCharacteristicData: Dispatch<SetStateAction<Record<string, NewCharacteristicData>>>
  setEditingCharacteristicData: Dispatch<SetStateAction<Record<string, Partial<CreateWineTasteCharacteristicParams>>>>
  groups: any
  items: any
  ui: any
}
