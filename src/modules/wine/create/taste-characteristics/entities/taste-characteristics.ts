import { BaseWineColor, NameDictionary } from '../../general/entities/types'

export interface LevelItem {
  id?: string
  translations?: NameDictionary[]
  sortNumber?: number
  isShowed?: boolean
}

export interface WineTasteCharacteristics {
  id: string
  translations?: NameDictionary[]
  description?: string
  colorHex: string
  levels: LevelItem[]
  colors: BaseWineColor[]
  sortNumber?: number
}

export type CreateWineTasteCharacteristicParams = Omit<WineTasteCharacteristics, 'id'>

export interface CreateWineTasteCharacteristicRequest {
  translations?: NameDictionary[]
  description?: string
  levels: LevelItem[]
  colorIds: string[]
  colorHex: string
  sortNumber?: number
}

export interface UpdateWineTasteCharacteristicParams {
  characteristicId: string
  newCharacteristic: CreateWineTasteCharacteristicRequest
}

export interface ReorderLevelParams {
  characteristicId: string
  levelIds: string[]
}
