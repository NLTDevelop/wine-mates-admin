export interface StateItem {
  id: string
  stateName: string
  order: number
}
export interface WineAromaItem {
  id: string
  name: string
  nameEn: string
  value: string
  state: StateItem[]
}

export interface WineAromaGroup {
  id: string
  label: string
  labelEn: string
  value: string
  items?: WineAromaItem[]
}

export interface CreateWineAromaGroupParams {
  label: string
  labelEn: string
  value: string
  items?: WineAromaItem[]
}

export interface UpdateWineAromaGroupParams {
  groupId: string
  newGroup: CreateWineAromaGroupParams
}

export interface CreateStateItemParams {
  stateName: string
  order: number
}

export interface UpdateStateItemParams {
  stateId: string
  newState: CreateStateItemParams
}

export interface CreateWineAromaItemParams {
  name: string
  nameEn: string
  value: string
  state?: StateItem[]
}

export interface UpdateWineAromaItemParams {
  groupId: string
  itemId: string
  newItem: CreateWineAromaItemParams
}
