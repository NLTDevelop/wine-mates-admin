import { BaseWineColor, NameDictionary } from '../../../general/entities/types'

export interface WineAromaItem {
  id?: string
  translations: NameDictionary[]
  colorHex?: string
  sortNumber?: number
}

export interface WineAromaSubgroup {
  id: string
  translations: NameDictionary[]
  sortNumber: number
  aromas: WineAromaItem[]
  colorHex: string
  groupId?: number
}

export interface WineAromaGroup {
  id: string
  nameUa?: string
  nameEn?: string
  translations: NameDictionary[]
  colorHex: string
  sortNumber: number
  subgroups: WineAromaSubgroup[]
  colors: BaseWineColor[]
}

export interface CreateWineAromaGroupParams {
  translations: NameDictionary[]
  colorHex: string
  sortNumber: number
  subgroups: WineAromaSubgroup[]
  colors: BaseWineColor[]
}

export interface CreateWineAromaGroupRequest {
  translations: NameDictionary[]
  colorHex: string
  colorIds: string[]
}

export interface UpdateWineAromaGroupParams {
  groupId: string
  newGroup: CreateWineAromaGroupRequest
}

export interface CreateWineAromaSubgroupParams {
  groupId?: number
  translations: NameDictionary[]
  sortNumber?: number
  aromas: WineAromaItem[]
  colorHex: string
}

export interface UpdateWineAromaSubgroupParams {
  subgroupId: string
  newSubgroup?: CreateWineAromaSubgroupParams
}

export interface ReorderSubgroupParams {
  groupId: string;
  subgroupIds: string[];
}

export interface ReorderAromasParams {
  subgrId: string;
  aromasIds: string[];
}
