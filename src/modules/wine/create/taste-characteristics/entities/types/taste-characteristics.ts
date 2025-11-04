
// Sweetness,Activity, Tanin (level), Tanin (intensity), Alcohol, Body, Finish, Wine Peak, Complexity, Viscosity, Oak, Fruitness

export interface LevelItem {
  id: string
  levelName: string
  order: number
}


export interface WineTasteCharacteristics {
  id: string
  label: string
  labelEn: string
  order: number
  levels?: LevelItem[] 
}

export interface CreateWineTasteCharacteristicParams {
  label: string
  labelEn: string
  order?: number
  levels?: LevelItem[] 
}



export interface UpdateWineTasteCharacteristicParams {
  characteristicId: string
  newCharacteristic: {
    label?: string
    labelEn?: string
    order?: number
    levels?: LevelItem[] 
  }
}

export interface CreateWineTasteItemParams {
  name: string
  nameEn: string
  order?: number
  level?: LevelItem[]
}

export interface UpdateWineTasteItemParams {
  characteristicId: string
  itemId: string
  newItem: CreateWineTasteItemParams
}