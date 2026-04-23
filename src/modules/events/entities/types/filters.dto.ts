import { EventType, TastingType } from './constants'

export interface IEventFilters {
  limit: number
  page: number
  search?: string
  minPrice?: number | null
  maxPrice?: number | null
  dateFrom?: string | null
  dateTo?: string | null
  isActive?: boolean | null
  countryId?: number | null
  eventType?: EventType | null
  tastingType?: TastingType | null
  createdAt?: string | null
  requiresConfirmation?: boolean | null
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterOption {
  id: number
  name: string
}

export interface EventFiltersData {
  price: FilterOption[]
  eventDate: FilterOption[]
  countries: FilterOption[]
  isActive: (boolean | null)[]
}
