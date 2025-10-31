export interface WineTaste {
  id: string
  label: string
  labelEn: string
  value: string
}

export interface CreateWineTasteParams {
  label: string
  labelEn: string
  value: string
}

export interface UpdateWineTasteParams {
  tasteId: string
  newTaste: CreateWineTasteParams
}