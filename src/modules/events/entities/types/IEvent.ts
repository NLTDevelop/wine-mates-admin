import { LocationWine } from '@/modules/wine/list/entities/types/types'
import { EventType, Language, ParticipationCondition, RepeatRule, Sex, TastingType } from './constants'
import { IWineSetResponse } from './wine-set.dto'

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
  latitude?: number
  longitude?: number
  eventDate: string
  eventTime: string
  priceUsd: string
  price: string
  currency: string
  speakerName: string
  language: Language
  seats: number
  eventType?: EventType
  tastingType?: TastingType
  isActive: boolean
  createdAt?: string
  country: LocationWine
  phoneNumber?: string
  description?: string
  wineSet?: IWineSetResponse[]
  requiresConfirmation?: boolean
  repeatRule?: RepeatRule
  sex?: Sex
  age?: number
  updatedAt?: string
  participationCondition?: ParticipationCondition
}
