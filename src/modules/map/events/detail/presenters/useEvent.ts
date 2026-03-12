import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Currency, Language, MapEvent, RepeatRule, TastingType } from '../../entities/types'

export const useEvent = () => {
  const { id } = useParams()

  // const { data: event, isLoading, error } = useQuery<MapEvent>({
  //   ...eventQueries.detail(Number(id)),
  //   enabled: !!id,
  // })

  const event = {
    locationLabel: 'Ukraine, Kyiv Reg, Irpin',
    latitude: 50.4501,
    longitude: 30.5234,
    theme: 'Natural Wine & Pet-Nats',
    restaurantName: 'Catch',
    eventDate: '2026-08-14',
    eventTime: '14:30',
    currency: 'UAH' as Currency,
    price: 5700,
    seats: 1,
    speakerName: 'Ihor Postoiankin',
    language: 'UA' as Language,
    phoneNumber: '+380501234567',
    tastingType: 'comparative' as TastingType,
    repeatRule: 'weekly' as RepeatRule,
    isActive: true,
    isOnline: true,
  }

  return {
    event,
    // isLoading,
    // error,
  }
}
