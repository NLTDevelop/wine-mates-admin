import { EVENT_SORT_FIELDS } from '@/constatnts/wine-filters'
import { MapEvent, TastingType } from '../../entities/types'
import { EventFormData } from '../../detail/presenters/event-form-schema'

export interface EventResponse {
  rows: MapEvent[]
  totalPages: number
  count: number
}

export type IUpdateEvent = MapEvent

export interface UpdateEventListParams {
  id: number
  data: EventFormData
}

export interface CancelEventParams {
  id: string | number
  isCanceled: boolean
}

export interface IEventFilters {
  search: string
  limit: number
  page: number
  currency?: string | null
  language?: string | null
  tastingType?: TastingType | null
  sortBy?: string
}
export interface FilterOption {
  id: number
  name: string
}

export interface RegionFilterOption extends FilterOption {
  countryId: number
}
export interface EventFiltersData {
  currency: FilterOption[]
  language: FilterOption[]
  tastingType: FilterOption[]
}

export type SortField = (typeof EVENT_SORT_FIELDS)[keyof typeof EVENT_SORT_FIELDS]
export type SortDirection = 'asc' | 'desc'

export type SortBy = `${SortField}_${SortDirection}`
