import { BaseWineColor } from '../../../general/entities/types'

export interface WineAromaItem {
  id?: string
  nameUa: string
  nameEn: string
  colorHex?: string
  sortNumber?: number
}

export interface WineAromaSubgroup {
  id: string
  nameUa: string
  nameEn: string
  sortNumber: number
  aromas: WineAromaItem[]
  groupId?: number
}

export interface WineAromaGroup {
  id: string
  nameUa: string
  nameEn: string
  colorHex: string
  sortNumber: number
  subgroups: WineAromaSubgroup[]
  colors: BaseWineColor[]
}

export interface CreateWineAromaGroupParams {
  nameUa: string
  nameEn: string
  colorHex: string
  sortNumber: number
  subgroups: WineAromaSubgroup[]
  colors: BaseWineColor[]
}

export interface CreateWineAromaGroupRequest {
  nameUa: string
  nameEn: string
  colorHex: string
  colorIds: string[]
}

export interface UpdateWineAromaGroupParams {
  groupId: string
  newGroup: CreateWineAromaGroupRequest
}

export interface CreateWineAromaSubgroupParams {
  groupId?: number
  nameUa: string
  nameEn: string
  sortNumber?: number
  aromas: WineAromaItem[]
}

export interface UpdateWineAromaSubgroupParams {
  subgroupId: string
  newSubgroup?: CreateWineAromaSubgroupParams
}
