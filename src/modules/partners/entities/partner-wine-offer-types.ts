import { WineImage } from '@/modules/wine/list/entities/types/types'

export interface PartnerWineOfferLocation {
  id?: number
  name?: string
}

export interface PartnerWineOfferWine {
  id: number
  name?: string
  producer?: string
  grapeVariety?: string
  vintage?: number
  country?: PartnerWineOfferLocation | string | null
  region?: PartnerWineOfferLocation | string | null
  image?: WineImage | null
  defaultImage?: WineImage | null
}

export interface PartnerWineOffer {
  id: number
  wineId: number
  offerableId: number
  offerableType: string
  partnerWineId?: string | null
  price: number | string
  currency: string
  quantity?: number | null
  websiteUrl?: string | null
  createdAt?: string
  updatedAt?: string
  wine?: PartnerWineOfferWine | null
}

export interface PartnerWineOffersFilters {
  partnerId: number
  page: number
  limit: number
}

export interface PartnerWineOffersResponse {
  data?: PartnerWineOffer[]
  rows?: PartnerWineOffer[]
  count?: number
  totalPages?: number
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreatePartnerWineOfferPayload {
  wineId: number
  partnerId: number
  price: number
  currency: string
  websiteUrl: string
  quantity?: number
}

export interface UpdatePartnerWineOfferPayload {
  price: number
  websiteUrl: string
  quantity?: number
}

export interface UpdatePartnerWineOfferParams {
  id: number
  data: UpdatePartnerWineOfferPayload
}
