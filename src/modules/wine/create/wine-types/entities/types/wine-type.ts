import { BaseWineColor, NameDictionary } from '../../../general/entities/types'

export interface WineType {
  id: string
  translations: NameDictionary[]
  colors: BaseWineColor[]
  sortNumber?: number
  nameUa?: string
  nameEn?: string
}

export interface CreateWineTypeParams {
  translations: NameDictionary[]
  colors: BaseWineColor[]
}
export interface CreateWineTypeRequest {
  translations: NameDictionary[]
  colorIds: string[]
}

export interface UpdateWineTypeParams {
  wineTypeId: string
  newWineType: CreateWineTypeRequest
}

export interface WineOption {
  id: string
  translations: NameDictionary[]
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
