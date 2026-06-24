import { BaseWineColor } from '@/modules/wine/create/general/entities/types'

export interface IWineSetResponse {
  id: number
  sortOrder: number
  avgUserRating: number
  avgExpertRating: number
  wine: IWine
}
export interface IWineSet {
  wineId: number
  sortOrder: number
}

export interface IWine {
  id: number
  name: string
  producer: string
  vintage: number
  image: WineImage
  vintages: IWineVintages[]
  type: IType
  color: BaseWineColor
}

interface WineImage {
  smallUrl: string
  mediumUrl: string
  originalUrl: string
}

interface IWineVintages {
  wineId: number
  vintage: number
}

interface IType {
  id: number
  isSparkling: boolean
  name: string
}
