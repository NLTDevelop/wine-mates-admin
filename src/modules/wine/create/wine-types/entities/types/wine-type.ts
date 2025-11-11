import { BaseWineColor } from "../../../general/entities/types"

export interface WineType {
  id: string
  label: string
  labelEn: string
  colors: BaseWineColor[]
}

export interface CreateWineTypeParams {
  label?: string
  labelEn?: string
  colors?: BaseWineColor[]
}

export interface UpdateWineTypeParams {
  wineTypeId: string
  newWineType: CreateWineTypeParams
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
