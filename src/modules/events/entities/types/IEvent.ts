import { LocationWine } from '@/modules/wine/list/entities/types/types'
import { EventType, Language, ParticipationCondition, RepeatRule, Sex, TastingType } from './constants'
import { IWineSetResponse } from './wine-set.dto'

export interface EventResponse {
  rows: IEvent[]
  totalPages: number
  count: number
}

export interface IEvent {
  country: LocationWine
  createdAt?: string
  currency: string
  description?: string
  eventEndDate: string
  eventEndTime: string
  eventStartDate: string
  eventStartTime: string
  eventDate?: string
  eventTime?: string
  eventType?: EventType
  id: number
  isActive: boolean
  isTastingStarted: boolean
  requiresConfirmation?: boolean
  language: Language
  latitude?: number
  locationLabel: string
  longitude?: number
  maxAge?: number
  minAge?: number
  participants: IParticipant[]
  participationCondition?: ParticipationCondition
  phoneNumber?: string
  price: string
  priceUsd: string
  repetitionNumber: number
  restaurantName: string
  seats: ISeats
  sex?: Sex
  speakerName: string
  status: string
  tastingType?: TastingType
  repeatRule?: RepeatRule
  theme: string
  userId: string

  paymentMethods?: IPaymentMethod[]
  contacts?: IContact[]
  wineSet?: IWineSetResponse[]
}

export interface IParticipant {
  id: number
  firstName: string
  lastName: string
  avatar: IImg | null
}

interface IImg {
  smallUrl: string
  mediumUrl: string
  originalUrl: string
}
export interface ISeats {
  total: number
  left: number
}

export interface IPaymentMethod {
  id: number
  name: string
  paymentDetails: string
  description: string
  isVisible: boolean
  qrCode: IImg | null
}

export interface IContact {
  id: number
  name: string
  value: string
  isVisible: boolean
}

export interface ICurrencyResponse {
  list: string[]
}
