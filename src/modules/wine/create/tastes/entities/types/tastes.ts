import { NameDictionary } from '../../../general/entities/types'

export interface WineTasteItem {
  id: string
  translations: NameDictionary[]
  sortNumber: number
  colorHex: string
  groupId?: number
}

export interface WineTasteGroup {
  id: string
  nameUa?: string
  nameEn?: string
  translations: NameDictionary[]
  colorHex: string
  sortNumber: number
  flavors?: WineTasteItem[]
}

export interface CreateWineTasteGroupParams {
  translations: NameDictionary[]
  colorHex: string
  sortNumber: number
}

export interface UpdateWineTasteGroupParams {
  groupId: string
  newGroup: CreateWineTasteGroupRequest
}

export interface CreateWineTasteGroupRequest {
  translations: NameDictionary[]
  colorHex: string
  sortNumber?: number
}

export interface CreateWineTasteParams {
  translations: NameDictionary[]
  sortNumber?: number
  colorHex: string
}

export interface UpdateWineTasteParams {
  groupId: string
  newTaste?: CreateWineTasteParams
}

export interface ReorderTasteParams {
  groupId: string
  tasteIds: string[]
}
