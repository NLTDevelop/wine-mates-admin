export const TASTING_TYPES = ['wine_set', 'comparative', 'blind'] as const
export type TastingType = (typeof TASTING_TYPES)[number]

export const CURRENCIES = ['UAH', 'USD', 'EUR'] as const
export type Currency = (typeof CURRENCIES)[number]

export enum Language {  UA = 'UA',  EN = 'EN',  DE = 'DE',  FR = 'FR'}
export const LANGUAGES = Object.values(Language) as [Language, ...Language[]]

export const REPEAT_RULES = ['never', 'daily', 'weekly', 'monthly'] as const
export type RepeatRule = (typeof REPEAT_RULES)[number]

export type MapEvent = {
  id: number
  userId: number
  theme: string
  restaurantName: string
  locationLabel: string
  latitude: number
  longitude: number
  countryId: number | null
  eventDate: string
  eventTime: string
  price: number
  currency: Currency
  speakerName: string | null
  language: string
  seats: number
  phoneNumber: string
  tastingType: TastingType
  repeatRule: RepeatRule
  isActive: boolean
  isOnline: boolean
  wineSet: number[]
}

export interface ICoordinate {
  lat: number
  lng: number
}

export type WineItem = {
  id: number
  name: string
  year?: number
  producer?: string
  price?: number
}
