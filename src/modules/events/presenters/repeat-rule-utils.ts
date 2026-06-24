import { RepeatRuleConfig, RepeatRuleDisplay, isRepeatPreset } from '@/modules/events/entities/types/constants'
import { TFunction } from 'i18next'

const pluralize = (count: number, t: TFunction, key: string): string => {
  const remainder10 = count % 10
  const remainder100 = count % 100

  if (remainder100 >= 11 && remainder100 <= 19) {
    return t(`repeat_rules.${key}_few`).toLowerCase()
  }

  if (remainder10 === 1) {
    return t(`repeat_rules.${key}_one`).toLowerCase()
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return t(`repeat_rules.${key}_two`).toLowerCase()
  }

  return t(`repeat_rules.${key}_few`).toLowerCase()
}

const getFrequencyText = (frequency: RepeatRuleConfig['frequency'], interval: number, t: TFunction): string => {
  const frequencyKey = t(frequency)

  if (interval === 1) {
    return t(`repeat_rules.${frequencyKey}`)
  }

  const pluralizedFrequency = pluralize(interval, t, frequency)
  return `${interval} ${pluralizedFrequency}`
}

const getEndConditionText = (endCondition: RepeatRuleConfig['endCondition'], t: TFunction): string => {
  if (!endCondition) return ''

  switch (endCondition.type) {
    case 'date':
      if (endCondition.value) {
        const date = new Date(endCondition.value as string)
        const formattedDate = date.toLocaleDateString('uk-UA')
        return `${t('repeat_rules.until')} ${formattedDate}`
      }
      return ''

    case 'count':
      if (endCondition.value) {
        const count = endCondition.value as number
        const pluralizedTimes = pluralize(count, t, 'times')
        return `${t('repeat_rules.end')} ${count} ${pluralizedTimes}`
      }
      return ''

    case 'never':
      return ''

    default:
      return ''
  }
}

const getWeekDaysText = (weekDays: number[]): string => {
  if (!weekDays || weekDays.length === 0) return ''

  const weekDaysMap: Record<number, string> = {
    1: 'понеділках',
    2: 'вівторках',
    3: 'середах',
    4: 'четвергах',
    5: "п'ятницях",
    6: 'суботах',
    0: 'неділях',
  }

  const daysText = weekDays.map(day => weekDaysMap[day]).join(', ')
  return `по ${daysText}`
}

const formatCustomRepeatRule = (rule: RepeatRuleConfig, t: TFunction): string => {
  const parts: string[] = []

  const frequencyText = getFrequencyText(rule.frequency, rule.interval, t)
  parts.push(frequencyText)

  if (rule.weekDays && rule.weekDays.length > 0) {
    parts.push(getWeekDaysText(rule.weekDays))
  }

  const endText = getEndConditionText(rule.endCondition, t)
  if (endText) parts.push(endText)

  return parts.join(' / ')
}

export const getRepeatRuleDisplayText = (rule: RepeatRuleDisplay | null | undefined, t: TFunction): string => {
  if (!rule) return t('repeat_rules.never')

  if (isRepeatPreset(rule)) {
    return t(`repeat_rules.${rule}`)
  }

  return formatCustomRepeatRule(rule, t)
}

export const isCustomRepeatRule = (rule: RepeatRuleDisplay | null | undefined): boolean => {
  if (!rule) return false
  if (isRepeatPreset(rule)) return false
  return true
}
