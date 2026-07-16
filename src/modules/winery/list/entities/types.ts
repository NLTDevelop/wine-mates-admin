import { LocationWine } from '@/modules/wine/list/entities/types/types'

export interface WineriesResponse {
  rows: IWinery[]
  totalPages: number
  count: number
}

export interface WineryFilters {
  limit: number
  page: number
  search?: string
  status?:WineriesType
  countryId?: number | null
  regionId?: number | null
}

export const WINERY_STATUS = {  APPROVED: 'approved',  REJECTED: 'rejected',  PENDING: 'pending'} as const
export type WineriesType = typeof WINERY_STATUS[keyof typeof WINERY_STATUS]

export interface IWinery {
  id: number
  name?: string
  foundedYear?: number
  description?: string
  country?: LocationWine
  region?: LocationWine
  status?:WineriesType
}





