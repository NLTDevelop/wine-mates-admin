import { WineImage } from '@/modules/wine/list/entities/types/types'

export interface WineSearchLocation {
  id?: number
  name?: string
}

export interface WineSearchParams {
  query?: string
  limit?: number
  offset?: number
}

export interface WineSearchItem {
  id: number
  name: string
  producer?: string
  vintage?: number
  grapeVariety?: string
  country?: WineSearchLocation | string | null
  region?: WineSearchLocation | string | null
  image?: WineImage | null
}

export interface WineSearchResponse {
  rows: WineSearchItem[]
  count: number
  totalPages: number
}
