export const TASTING_TYPES = ['regular', 'blind'] as const
export type TastingType = (typeof TASTING_TYPES)[number]

// export const CURRENCIES = ['UAH', 'USD', 'EUR'] as const
// export type Currency = (typeof CURRENCIES)[number]

export const SEX = ['all', 'men', 'women'] as const
export type Sex = (typeof SEX)[number]

export const LANGUAGES = ['en', 'uk', 'fr', 'pl', 'de', 'es', 'it'] as const
export type Language = (typeof LANGUAGES)[number]

export const EVENT_TYPE = ['parties', 'tastings'] as const
export type EventType = (typeof EVENT_TYPE)[number]

export const REPEAT_RULES = ['never', 'daily', 'weekly', 'monthly'] as const
export type RepeatRule = (typeof REPEAT_RULES)[number]

export const PARTICIPATION_CONDITION = ['fixed_price', 'split_bill', 'free', 'charity', 'host', 'guest'] as const
export type ParticipationCondition = (typeof PARTICIPATION_CONDITION)[number]
