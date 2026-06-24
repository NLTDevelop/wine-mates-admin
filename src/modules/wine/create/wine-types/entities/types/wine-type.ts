import { NameDictionary } from '../../../general/entities/types'

export interface WineType {
  id: string
  translations: NameDictionary[]
  sortNumber: number
  nameUa?: string
  nameEn?: string
  isSparkling?: boolean
}

export interface CreateWineTypeParams {
  translations: NameDictionary[]
  isSparkling?: boolean
}
export interface CreateWineTypeRequest {
  translations: NameDictionary[]
  isSparkling?: boolean
  sortNumber?: number
}

export interface UpdateWineTypeParams {
  wineTypeId: string
  newWineType: CreateWineTypeRequest
  isSparkling?: boolean
}

export interface WineOption {
  id: string
  translations: NameDictionary[]
  value?: string
  description?: string
  metadata?: {
    group?: string
    intensity?: number
    category?: string
    [key: string]: any
  }
}
