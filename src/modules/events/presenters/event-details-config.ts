import { IEvent } from '../entities/types'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Award, Calendar, CheckCircle, Clock, DollarSign, MapPin, Phone, Repeat, User } from 'lucide-react'

export interface DetailItem {
  icon: any
  label: string
  value: string
}

export const getEventDetails = (event: IEvent): DetailItem[] => {
  const { t } = useTranslation('events')

  const formatEventDate = (date: string) => {
    return format(new Date(date), 'dd MMMM yyyy')
  }

  const formatDateTime = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy HH:mm')
  }

  const details: DetailItem[] = [
    { icon: Calendar, label: t('date'), value: formatEventDate(event.eventDate) },
    { icon: Calendar, label: t('language'), value: event.language },
    { icon: Clock, label: t('time'), value: event.eventTime },
    { icon: User, label: t('speaker_name'), value: event.speakerName },
    { icon: MapPin, label: t('address'), value: event.locationLabel },
    { icon: Calendar, label: t('seats'), value: t('places', { count: event.seats }) },
    { icon: DollarSign, label: t('price'), value: `${event.price} ${event.currency}` },
  ]
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

  if (event.updatedAt) {
    details.push({
      icon: Clock,
      label: t('updated_at'),
      value: formatDateTime(event.updatedAt),
    })
  }

  if (event.phoneNumber) {
    details.push({
      icon: Phone,
      label: t('phone'),
      value: event.phoneNumber,
    })
  }

  if (event.tastingType) {
    details.push({
      icon: Award,
      label: t('event_type'),
      value: t(`event_types.${event.tastingType}`),
    })
  }

  return details
}
