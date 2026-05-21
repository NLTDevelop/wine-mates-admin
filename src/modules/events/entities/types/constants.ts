export const TASTING_TYPES = ['regular', 'blind'] as const
export type TastingType = (typeof TASTING_TYPES)[number]

export const SEX = ['all', 'men', 'women'] as const
export type Sex = (typeof SEX)[number]

export const LANGUAGES = ['en', 'uk', 'fr', 'pl', 'de', 'es', 'it'] as const
export type Language = (typeof LANGUAGES)[number]

export const EVENT_TYPE = ['parties', 'tastings'] as const
export type EventType = (typeof EVENT_TYPE)[number]

export const FREQUENCY = ['day', 'week', 'month', 'year'] as const
export type Frequency = (typeof FREQUENCY)[number]

export const END_CONDITION_TYPE = ['never', 'count', 'date'] as const
export type EndConditionType = (typeof END_CONDITION_TYPE)[number]

export interface RepeatRuleConfig {
  frequency: Frequency
  interval: number
  weekDays?: number[]
  endCondition: {
    type: EndConditionType
    value?: number | string
  }
}

export const REPEAT_PRESETS = ['never', 'daily', 'weekly', 'monthly'] as const
export type RepeatPreset = (typeof REPEAT_PRESETS)[number]

export const PARTICIPATION_CONDITION = ['fixed_price', 'split_bill', 'free', 'charity', 'host', 'guest'] as const
export type ParticipationCondition = (typeof PARTICIPATION_CONDITION)[number]
