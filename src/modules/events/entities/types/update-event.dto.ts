import { EventType, Language, ParticipationCondition, RepeatRule, Sex, TastingType } from './constants'
import { IWineSet } from './wine-set.dto'

export interface UpdateEventParams {
  id: number
  data: EventFormData
}

export interface EventFormData {
  theme?: string
  description?: string
  restaurantName?: string
  locationLabel?: string
  eventStartDate?: string
  eventStartTime?: string
  eventEndDate?: string
  eventEndTime?: string
  participationCondition?: ParticipationCondition
  price?: number
  currency?: string
  speakerName?: string
  language?: Language
  seats?: number
  phoneNumber?: string
  minAge?: number
  maxAge?: number
  sex?: Sex
  eventType?: EventType
  tastingType?: TastingType
  requiresConfirmation?: boolean
  repeatRule?: RepeatRule
  isActive?: boolean
  wineSet?: IWineSet[]
}
