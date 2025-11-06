export interface WineType {
  id: string
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
  id: string
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

export interface WineOption {
  id: string
  name: string
  nameEn?: string
  value?: string
  color?: string
  description?: string
  metadata?: {
    group?: string
    intensity?: number
    category?: string
    [key: string]: any
  }
}

export interface WineCharacteristics {
  sweetness: number
  acidity: number
  tanninLevel: number
  tanninIntensity: number
  alcohol: number
  body: number
  finish: number
}

export interface WineAging {
  peakStart: number
  peakEnd: number
  potential?: number
}

export interface WineBasicInfo {
  name: string
  fullDescription: string
  region: string
  country: string
  vintage: number
  imageUrl: string
  subtitle: string
  wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert'
  grapeVarieties?: string[]
}

export interface TagsSection {
  descriptors: string[]
  intensity?: number
  complexity?: number
}
