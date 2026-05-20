import { useTranslation } from 'react-i18next'
import { format, parse } from 'date-fns'
import { Award, Cake, Calendar, CheckCircle, ClipboardCheck, Clock, DollarSign, Hourglass, ListChecks, MapPin, Phone, PhoneCall, Repeat, User, UserCheck } from 'lucide-react'
import { IEvent } from '../entities/types/IEvent'

export interface DetailItem {
  icon: any
  label: string
  value?: string | number
}

export const getEventDetails = (event: IEvent): DetailItem[] => {
  const { t } = useTranslation('events')

  const formatEventDate = (dateOrig: string) => {
    const date = parse(dateOrig, 'yyyy-MM-dd', new Date())
    return format(date, 'dd.MM.yy')
  }

  const formatTime = (timestamp: string) => {
    const time = parse(timestamp, 'HH:mm:ss', new Date())

    return format(time, 'HH:mm')
  }

  const details: DetailItem[] = [
    { icon: Calendar, label: t('date'), value: `${formatEventDate(event.eventStartDate)} - ${formatEventDate(event.eventEndDate)}` },
    { icon: Calendar, label: t('language'), value: event.language },
    { icon: Clock, label: t('time'), value: `${formatTime(event.eventStartTime)} - ${formatTime(event.eventEndTime)}` },
    { icon: User, label: t('speaker_name'), value: event.speakerName },
    { icon: MapPin, label: t('address'), value: event.locationLabel },
    { icon: Calendar, label: t('seats'), value: `${t('places', { count: event.seats.total })} (${t('left_place', { count: event.seats.left })})` },
    { icon: DollarSign, label: t('price'), value: `${event.price} ${event.currency}` },
    { icon: ClipboardCheck, label: t('participation_сondition'), value: t(`participationCondition.${event.participationCondition}`) },
  ]
  if (event.minAge || event.maxAge) {
    const value = event.minAge && event.maxAge ? `${event.minAge} - ${event.maxAge}` : event.minAge || event.maxAge
    const label = event.minAge && event.maxAge ? t('age') : event.minAge ? t('min_age') : t('max_age')
    details.push({ icon: User, label: label, value: value })
  }
  if (event.requiresConfirmation !== undefined) {
    details.push({
      icon: CheckCircle,
      label: t('requires_confirmation'),
      value: event.requiresConfirmation ? t('yes') : t('no'),
    })
  }

  if (event.repeatRule) {
    details.push({
      icon: Repeat,
      label: t('repeat_rule'),
      value: t(`repeat_rules.${event.repeatRule}`),
    })
  }

  if (event.phoneNumber) {
    details.push({
      icon: Phone,
      label: t('phone'),
      value: event.phoneNumber,
    })
  }

  if (event.eventType) {
    details.push({
      icon: Award,
      label: t('event_type'),
      value: t(`event_types.${event.eventType}`),
    })
  }
  if (event.tastingType) {
    details.push({
      icon: Award,
      label: t('tasting_type'),
      value: t(`tasting_types.${event.tastingType}`),
    })
  }

  return details
}
