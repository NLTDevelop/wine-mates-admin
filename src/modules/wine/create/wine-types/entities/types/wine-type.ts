import { BaseWineColor } from '../../../general/entities/types'

export interface WineType {
  id: string
  nameUa: string
  nameEn: string
  colors: BaseWineColor[]
}

export interface CreateWineTypeParams {
  nameUa: string
  nameEn: string
  colors: BaseWineColor[]
}
export interface CreateWineTypeRequest {
  nameUa: string
  nameEn: string
  colorIds: string[]
}

export interface UpdateWineTypeParams {
  wineTypeId: string
  newWineType: CreateWineTypeRequest
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
