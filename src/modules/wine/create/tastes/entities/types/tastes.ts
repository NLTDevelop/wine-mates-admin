import { BaseWineColor } from '../../../general/entities/types'

export interface WineTaste {
  id: string
  nameUa: string
  nameEn: string
  colorHex: string
  colors: BaseWineColor[]
}

export interface CreateWineTasteParams {
  nameUa: string
  nameEn: string
  colorHex: string
  colors: BaseWineColor[]
}
export interface CreateWineTasteRequest {
  nameUa: string
  nameEn: string
  colorHex: string
  colorIds: string[]
}

export interface UpdateWineTasteParams {
  tasteId: string
  newTaste: CreateWineTasteRequest
}
