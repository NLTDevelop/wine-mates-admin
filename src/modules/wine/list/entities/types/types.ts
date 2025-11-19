import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'

export interface WinesResponse {
  rows: IWines[]
  totalCount: number
}

export interface WineFilters {
  limit: number
  page: number
  search?: string
}

export interface IWines {
  id?: string
  displayName?: string
  producerTitle?: string
  producerName?: string
  wine?: string
  grapeVariety?: string
  country?: string
  region?: string
  subRegion?: string
  site?: string

  type?: WineType
  subType?: string
  designation?: string
  classification?: string

  vintageConfig?: number
  firstVintage?: number
  finalVintage?: number

  reference?: string
  description?: string
  images?: WineImage[]
  isConfirmed?: boolean
}

export interface ConfirmWineParams {
  id: string | number
  isConfirmed: boolean
}

export interface UpdateWineListParams {
  id: string
  data: IWines
}

export interface WineImage {
  id: string
  url: string
  thumbnailUrl?: string
  alt?: string
  order: number
  fileSize?: number
  mimeType?: string
}

export interface ImportWineParams {
  file: File
}
