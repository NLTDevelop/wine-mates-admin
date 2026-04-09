import { Language } from '@/modules/wine/create/general/entities/types'
import { LocationWine } from '@/modules/wine/list/entities/types/types'

export interface EventResponse {
  rows: IEvent[]
  totalPages: number
  count: number
}

export interface IEvent {
  id: number
  theme: string
  restaurantName: string
  locationLabel: string
  latitude: number
  longitude: number
  eventDate: string
  eventTime: string
  priceUsd: string
  price: string
  currency: string
  speakerName: string
  language: Language
  seats: number
  tastingType?: 'parties' | 'tastings' //поміняти на eventType
  isActive: boolean
  createdAt?: string
  country: LocationWine
  phoneNumber?: string
  description?: string
  wineSet?: IWineSet[]
  requiresConfirmation?: boolean
  repeatRule?: 'never' | 'daily' | 'weekly' | 'monthly'
  sex?: 'all' | 'man' | 'women'
  updatedAt?: string
}

export interface IWineSet {
  id: number
  sortOrder: number
  wine: IWine
}

export interface IWine {
  id: number
  name: string
  producer: string
  vintage: number
  image: IWineImg
  vintages: IWineVintages[]
}

interface IWineImg {
  smallUrl: string
  mediumUrl: string
}

interface IWineVintages {
  wineId: number
  vintage: number
}

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
