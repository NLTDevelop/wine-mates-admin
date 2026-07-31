import { IWineFilters } from '@/modules/wine/list/entities/types/types'

export interface WineListImage {
  name?: string
  smallUrl?: string
  mediumUrl?: string
  originalUrl?: string
  originUrl?: string
}

export interface WineListOfWineryResponse {
  count: number
  rows: WineOfWinery[]
}

export interface WineryWineOffer {
  id?: number | null
  price?: number | string | null
  currency?: string | null
  quantity?: number | null
  websiteUrl?: string | null
}

export interface WineOfWinery {
  id: string | number
  offerId?: number | null
  wineOfferId?: number | null
  wineryWineOfferId?: number | null
  offer?: WineryWineOffer | null
  wineOffer?: WineryWineOffer | null
  wineryWineOffer?: WineryWineOffer | null
  offers?: WineryWineOffer[] | null
  name?: string
  producer?: string
  vintage?: string | number
  grapeVariety?: string
  image?: WineListImage | null
  price?: number | string | null
  currency?: string | null
  quantity?: number | null
  websiteUrl?: string | null
}

export interface AddWineToWineryParams {
  wineryId: string | number
  wineIds: number[]
}

export interface WineryWineOfferPayload {
  price: number
  currency?: string
  quantity?: number
  websiteUrl?: string
}

export interface CreateWineOfferForWineryParams extends WineryWineOfferPayload {
  wineryId: string | number
  wineId: number
}

export interface UpdateWineOfferForWineryParams {
  id: number
  data: WineryWineOfferPayload
}

export interface DeleteWineFromWineryParams {
  wineryId: string | number
  wineIds: number[]
}

export interface WineListFilters {
  limit: number
  page: number
  search?: string
}

export interface WineListEmptyWineryFilters extends IWineFilters {
  wineryId?: number
}
