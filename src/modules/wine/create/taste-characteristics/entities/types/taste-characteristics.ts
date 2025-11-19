import { BaseWineColor } from '../../../general/entities/types'

export interface LevelItem {
  id?: string
  nameUa: string
  nameEn: string
  sortNumber?: number
}

export interface WineTasteCharacteristics {
  id: string
  nameUa: string
  nameEn: string
  sortNumber: number
  levels?: LevelItem[]
  colors: BaseWineColor[]
}

export interface CreateWineTasteCharacteristicParams {
  nameUa: string
  nameEn: string
  sortNumber: number
  levels: LevelItem[]
  colors: BaseWineColor[]
}

export interface CreateWineTasteCharacteristicRequest {
  nameUa: string
  nameEn: string
  sortNumber?: number
  levels: LevelItem[]
  colorIds: string[]
}

export interface UpdateWineTasteCharacteristicParams {
  characteristicId: string
  newCharacteristic: CreateWineTasteCharacteristicParams
}

export interface CreateWineTasteLevelParams {
  name: string
  nameEn: string
  sortNumber?: number
  level?: LevelItem[]
}

export interface UpdateWineTasteLevelParams {
  characteristicId?: string
  levelId: string | number
  newILevel?: CreateWineTasteLevelParams
}
