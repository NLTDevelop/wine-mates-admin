import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { WineFormData } from '@/modules/wine/create-taste/presenters/wine-form-schema'
import { TasteCharacteristic, TopAroma, TopColor, TopFlavor } from './statistics-types'
import { IBaseInfo } from '@/modules/chemical-analysis/detail/entities/chemical_types'

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

export type ReviewFilters = WineFilters & { wineId: number | null }

export interface TypeWine {
  id: number
  name: string
  isSparkling: boolean
}
export type LocationWine = Omit<TypeWine, 'isSparkling'>

export interface IVintage {
  wineId: number
  vintage: number
}

export interface IStatistics {
  topColor: TopColor[]
  topAromas: TopAroma[]
  topFlavors: TopFlavor[]
  tasteCharacteristics: TasteCharacteristic[]
}
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
  vintages?: IVintage[]
  averageUserRating?: number
  averageExpertRating?: number
  totalReviews?: number
  statistics?: IStatistics
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

export interface Avatar {
  smallUrl: string
  mediumUrl: string
  originalUrl: string
}

export interface ReviewUser {
  id: number
  firstName: string
  lastName: string
  wineExperienceLevel: string
  avatar: Avatar | null
}
export interface IReview {
  id: number
  userRating?: number
  expertRating?: number
  review: string
  createdAt: string
  user: ReviewUser
  statistics?: IStatistics
}

export interface ReviewsResponse {
  count: number
  totalPages: number
  rows: IReview[]
}

export interface IBaseInfoCharacteristics extends IBaseInfo {
  isPremium: boolean
  selectedLevel: {
    sortNumber: number
    name: string
  }
}

export interface IReviewDetail {
  color: {
    name: string
    colorHex: string
    mousse: number
    perlage: number
    appearance: number
    shade: {
      colorHex: string
      name: string
      tone: string
    }
  }
  aromas: IBaseInfo[]
  flavors: IBaseInfo[]
  tasteCharacteristics: IBaseInfoCharacteristics[]
}
