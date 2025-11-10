import { BaseWineColor } from "../../../general/entities/types"

export interface WineTaste {
  id: string
  label: string
  labelEn: string
  value: string
  colors: BaseWineColor[] 
}

export interface CreateWineTasteParams {
  label: string
  labelEn: string
  value: string
  colors: BaseWineColor[] 
}

export interface UpdateWineTasteParams {
  tasteId: string
  newTaste: CreateWineTasteParams
}
