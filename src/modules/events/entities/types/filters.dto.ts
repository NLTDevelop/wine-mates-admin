import { EVENT_SORT_FIELDS } from '@/constatnts/wine-filters'
import { EventType, TastingType } from './constants'

export interface IEventFilters {
  limit: number
  page: number
  search?: string
  currency?: string | null
  language?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  dateFrom?: string | null
  dateTo?: string | null
  isActive?: boolean | null
  countryId?: number | null
  eventType?: EventType | null
  tastingType?: TastingType | null
  requiresConfirmation?: boolean | null
  sortBy?: string
}

export interface FilterOption {
  id: number
  name: string
}

export interface EventFiltersData {
  price: FilterOption[]
  date: FilterOption[]
  countries: FilterOption[]
  isActive: (boolean | null)[]
  requiresConfirmation: (boolean | null)[]
  currency: (string | null)[]
  language: (string | null)[]
  eventType: (EventType | null)[]
  tastingType: (TastingType | null)[]
}

export type SortField = (typeof EVENT_SORT_FIELDS)[keyof typeof EVENT_SORT_FIELDS]
export type SortDirection = 'asc' | 'desc'

export type SortBy = `${SortField}_${SortDirection}`
