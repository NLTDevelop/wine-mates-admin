export interface WineType {
  value: string
  label: string
  labelEn?: string
  colors: string[]
  aromas: string[]
  flavorNotes: string[]
  flavorCharacteristics: string[]
}

//нужно будет удалить
export interface WineColor {
  id: string
  label: string
  labelEn: string
  tones: {
    pale?: string
    medium?: string
    deep?: string
  }
}

export interface WineAroma {
  value: string
  label: string
  subAromas: string[]
}

export interface WineFlavor {
  value: string
  label: string
  characteristics: string[]
}

export interface CreateWineTypeParams {
  label: string
  labelEn?: string
  colors: string[]
  aromas: string[]
  flavorNotes: string[]
  flavorCharacteristics: string[]
}

export interface UpdateWineTypeParams {
  oldValue: string
  newWineType: WineType
}
