export interface WineAromaItem {
  id: string
  name: string
  nameEn: string
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

export interface CreateWineAromaItemParams {
  name: string
  nameEn: string
  description?: string
}

export interface UpdateWineAromaItemParams {
  groupId: string
  itemId: string
  newItem: CreateWineAromaItemParams
}
