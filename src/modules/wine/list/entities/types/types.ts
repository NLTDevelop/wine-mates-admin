import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { WineFormData } from '@/modules/wine/create/wine/presenters/wine-form-schema'

export interface WinesResponse {
  rows: IWines[]
  totalPages: number
  count: number
}

export interface WineFilters {
  limit: number
  page: number
  search?: string
}

export interface TypeWine {
  id: number
  name: string
  isSparkling: boolean
}
export type LocationWine = Omit<TypeWine, 'isSparkling'>

export interface IWines {
  id?: string
  name?: string
  vintage?: number
  country?: LocationWine
  region?: LocationWine
  producer?: string
  grapeVariety?: string
  type?: TypeWine
  color?: BaseWineColor
  image?: WineImage
  isConfirmed?: boolean
}

export interface CreateWineRequest {
  id?: string
  name: string
  vintage?: number | null
  countryId?: number | null
  regionId?: number | null
  producer?: string
  grapeVariety?: string
  image?: Image | null
  typeId: number | null
  colorId: number | null
}

export interface ConfirmWineParams {
  id: string | number
  isConfirmed: boolean
}

export interface UpdateWineListParams {
  id: string
  data: WineFormData
}

export interface Image {
  id: string
  url: string
  thumbnailUrl?: string
  alt?: string
  order: number
  fileSize?: number
  mimeType?: string
  preview?: string
  _isExistingImage?: boolean
}

export interface WineImage {
  name: string
  originalName: string
  mimetype: string
  size: number
  smallUrl: string
  mediumUrl: string
  originalUrl: string
}

export interface ImportWineParams {
  file: File
}
