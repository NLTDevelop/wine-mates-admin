// Sweetness,Activity, Tanin (level), Tanin (intensity), Alcohol, Body, Finish, Wine Peak, Complexity, Viscosity, Oak, Fruitness

import { BaseWineColor } from '../../../general/entities/types'

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
  colors: BaseWineColor[]
}

export interface CreateWineTasteCharacteristicParams {
  label?: string
  labelEn?: string
  order?: number
  levels?: LevelItem[]
  colors?: BaseWineColor[]
}

export interface UpdateWineTasteCharacteristicParams {
  characteristicId: string
  newCharacteristic: CreateWineTasteCharacteristicParams
}

export interface CreateWineTasteItemParams {
  name: string
  nameEn: string
  order?: number
  level?: LevelItem[]
}

export interface UpdateWineTasteItemParams {
  characteristicId?: string
  itemId: string | number
  newItem?: CreateWineTasteItemParams
}
