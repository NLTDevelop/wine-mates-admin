import { Language, NameDescriptionDictionary, NameDictionary } from '../../general/entities/types'

export type CreateTranslation =
  | {
      name: string
      language: Language
    }
  | {
      description: string
      language: Language
    }

export type UpdateTranslation =
  | {
      id?: string
      name: string
      language: Language
    }
  | {
      id?: string
      description: string
      language: Language
    }

export interface LevelItem {
  id?: string
  translations?: NameDictionary[]
  sortNumber: number
}

export interface WineTasteCharacteristics {
  id: string
  translations?: NameDescriptionDictionary[][]
  colorHex: string
  levels: LevelItem[]
  sortNumber: number
  isPremium: boolean
  qtyLevels: 2 | 3
}

export type CreateWineTasteCharacteristicParams = Omit<WineTasteCharacteristics, 'id'>

export interface CreateWineTasteCharacteristicRequest {
  translations?: CreateTranslation[]
  levels: LevelItem[]
  colorHex: string
  sortNumber?: number
  isPremium: boolean
  qtyLevels: 2 | 3
}

export interface UpdateWineTasteCharacteristicRequest {
  translations?: UpdateTranslation[]
  levels: LevelItem[]
  colorHex: string
  sortNumber?: number
  isPremium: boolean
  qtyLevels: 2 | 3
}

export interface UpdateWineTasteCharacteristicParams {
  characteristicId: string
  newCharacteristic: UpdateWineTasteCharacteristicRequest
}

export interface ReorderLevelParams {
  characteristicId: string
  levelIds: string[]
}
