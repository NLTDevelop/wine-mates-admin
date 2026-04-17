import { EventType, Language, ParticipationCondition, RepeatRule, Sex, TastingType } from './constants'
import { IWineSet } from './wine-set.dto'

export interface UpdateEventParams {
  id: number
  data: EventFormData
}

export interface EventFormData {
  theme?: string
  restaurantName?: string
  eventDate?: string
  eventTime?: string
  priceUsd?: string
  currency?: string
  speakerName?: string
  language?: Language
  seats?: number
  phoneNumber?: string
  age?: number
  sex?: Sex
  eventType?: EventType
  isActive?: boolean
  requiresConfirmation?: boolean
  repeatRule?: RepeatRule
  wineSet?: IWineSet[]
  tastingType?: TastingType
  participationCondition?: ParticipationCondition
}
