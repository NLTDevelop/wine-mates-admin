import { BaseWineColor, NameDictionary } from '../../../general/entities/types'

export interface WineTaste {
  id: string
  translations: NameDictionary[]
  colorHex: string
  colors: BaseWineColor[]
  sortNumber: number
}

export type CreateWineTasteParams = Omit<WineTaste, 'id'>

export interface CreateWineTasteRequest {
  translations: NameDictionary[]
  colorHex: string
  colorIds: string[]
  sortNumber?: number
}

export interface UpdateWineTasteParams {
  tasteId: string
  newTaste: CreateWineTasteRequest
}
