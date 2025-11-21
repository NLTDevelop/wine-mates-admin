import { NameDictionary } from "../../../general/entities/types"

export interface EditingGroupState {
  groupId: string
  editingItem?: any
  isEditingGroup?: boolean
}

export interface NewShadeData {
  // nameUa: string
  // nameEn: string
   translations: NameDictionary[]
  tonePale: string
  toneMedium: string
  toneDeep: string
  colorHex: string
  sortNumber: number
}
