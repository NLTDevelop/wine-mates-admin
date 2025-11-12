import { BaseWineColor } from '../../../general/entities/types'

export interface StateItem {
  id: string
  stateName: string
  order: number
}

export interface WineAromaItem {
  id: string
  nameUa: string
  nameEn: string
  colorHex: string
  sortNumber: number
}

export interface WineAromaSubgroup {
  id: string
  nameUa: string
  nameEn: string
  sortNumber: number
  aromas: WineAromaItem[]
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

export interface UpdateWineAromaGroupParams {
  groupId: string
  newGroup: CreateWineAromaGroupParams
}

export interface CreateWineAromaItemParams {
  nameUa: string
  nameEn: string
  aromas?: WineAromaItem[]
}

export interface UpdateWineAromaItemParams {
  itemId: string
  newItem: CreateWineAromaItemParams
}

export interface CreateWineAromaSubgroupParams {
  nameUa: string
  nameEn: string
  sortNumber: number
  aromas: WineAromaItem[]
}

export interface UpdateWineAromaSubgroupParams {
  subgroupId: string
  newSubgroup: CreateWineAromaSubgroupParams
}

export interface CreateStateItemParams {
  stateName: string
  order: number
}

export interface UpdateStateItemParams {
  stateId: string
  newState: CreateStateItemParams
}
