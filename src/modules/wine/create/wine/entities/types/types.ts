import { WineType } from '../../../wine-types/entities/types/wine-type'

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
  createdAt?: string
  updatedAt?: string
}

export interface WineImage {
  id: string
  url: string
  thumbnailUrl?: string
  alt?: string
  order: number
}

export interface CreateWineRequest {
  displayName: string
  producerTitle: string
  producerName: string
  wine: string
  grapeVariety: string
  country: string
  region?: string
  subRegion?: string
  site?: string
  typeId: string
  subType?: string
  designation?: string
  classification?: string
  vintageConfig?: number
  firstVintage?: number
  finalVintage?: number
  reference?: string
  description?: string
  images: File[]
}

export interface UpdateWineParams {
  wineId: string
  newWine: Partial<CreateWineRequest>
}

export interface ConfirmWineParams {
  id: string
  isConfirmed: boolean
}

