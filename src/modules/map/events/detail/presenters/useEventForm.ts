import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEventFormSchema, EventFormData } from './event-form-schema'
import { Language, MapEvent } from '../../entities/types'

interface UseEventFormProps {
  initialData?: Partial<MapEvent> | null
  locationData?: {
    latitude: number
    longitude: number
    locationLabel: string
    userId?: number
  }
}

export const useEventForm = ({ initialData, locationData }: UseEventFormProps = {}) => {
  const formData = locationData || initialData ? mapDataToFormData(initialData, locationData) : undefined

  const form = useForm<EventFormData>({
    resolver: zodResolver(createEventFormSchema()),
    defaultValues: {
      theme: formData?.theme || '',
      restaurantName: formData?.restaurantName || '',
      locationLabel: formData?.locationLabel || '',

      latitude: formData?.latitude || 50.4501,
      longitude: formData?.longitude || 30.5234,

      eventDate: formData?.eventDate || new Date().toISOString().split('T')[0],
      eventTime: formData?.eventTime || '',

      currency: formData?.currency || 'UAH',
      price: formData?.price,
      seats: formData?.seats,

      speakerName: formData?.speakerName || '',
      language: formData?.language || Language.UA,
      phoneNumber: formData?.phoneNumber || '',

      tastingType: formData?.tastingType || 'wine_set',
      repeatRule: formData?.repeatRule || 'never',
      isActive: formData?.isActive ?? true,
      isOnline: formData?.isOnline ?? false,

      // wineSet: formData?.wineSet || [],
    },
    mode: 'onChange',
  })

  return form
}

const mapDataToFormData = (initialData?: Partial<MapEvent> | null, locationData?: { latitude: number; longitude: number; locationLabel: string; userId?: number }): Partial<EventFormData> => {
  if (locationData) {
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      locationLabel: locationData.locationLabel,
    }
  }

  if (initialData) {
    return {
      theme: initialData.theme,
      restaurantName: initialData.restaurantName,
      locationLabel: initialData.locationLabel,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      eventDate: initialData.eventDate,
      eventTime: initialData.eventTime,
      price: initialData.price,
      currency: initialData.currency,
      speakerName: initialData.speakerName,
      language: (initialData.language as Language) || Language.UA,
      seats: initialData.seats,
      phoneNumber: initialData.phoneNumber,
      tastingType: initialData.tastingType,
      repeatRule: initialData.repeatRule,
      isActive: initialData.isActive,
      isOnline: initialData.isOnline,
      // wineSet: initialData.wineSet,
    }
  }

  return {}
}
