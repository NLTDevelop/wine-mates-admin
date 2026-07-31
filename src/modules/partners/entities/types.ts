/* global File */
import { Country } from '@/modules/wine/create-wine/entities/types/location-types'

export const PARTNER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type PartnerStatus = (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS]

export interface PartnerImage {
  id: number | string
  name?: string
  originalName?: string
  mimetype?: string
  size?: number
  smallUrl?: string
  mediumUrl?: string
  originalUrl?: string
}

export interface IPartner {
  id: number
  name: string
  website?: string | null
  status: PartnerStatus
  createdAt?: string
  logo?: PartnerImage | null
  image?: PartnerImage | null
  countries?: Country[]
  countryIds?: number[]
}

export interface PartnerFilters {
  limit: number
  page: number
  search?: string
  status?: PartnerStatus | null
}

export interface PartnersResponse {
  rows: IPartner[]
  count: number
  totalPages?: number
}

export interface PartnerFormPayload {
  name: string
  website?: string | null
  countryIds: number[]
  status?: PartnerStatus
  logo?: File | null
  image?: File | null
}

export interface UpdatePartnerParams {
  id: string | number
  data: PartnerFormPayload
}
