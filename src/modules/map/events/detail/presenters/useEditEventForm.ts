import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useEvent } from './useEvent'
import { useUpdateEvent } from './useUpdateEvent'
import { useEventForm } from './useEventForm'
import { EventFormData } from './event-form-schema'
import { Language } from '../../entities/types'

export const useEditEventForm = () => {
  const location = useLocation()
  const eventDataFromState = location.state?.event

  const { event: eventFromQuery /*isLoading: isEventLoading*/ } = useEvent()

  const eventData = eventDataFromState || eventFromQuery

  const form = useEventForm({
    initialData: eventData,
  })

  const { updateEvent /* isUpdating*/ } = useUpdateEvent()

  useEffect(() => {
    if (eventFromQuery && !eventDataFromState) {
      form.reset({
        theme: eventFromQuery.theme,
        restaurantName: eventFromQuery.restaurantName,
        locationLabel: eventFromQuery.locationLabel,
        latitude: eventFromQuery.latitude,
        longitude: eventFromQuery.longitude,
        eventDate: eventFromQuery.eventDate,
        eventTime: eventFromQuery.eventTime,
        price: eventFromQuery.price,
        currency: eventFromQuery.currency,
        speakerName: eventFromQuery.speakerName,
        language: (eventFromQuery.language as Language) || Language.UA,
        seats: eventFromQuery.seats,
        phoneNumber: eventFromQuery.phoneNumber,
        tastingType: eventFromQuery.tastingType,
        repeatRule: eventFromQuery.repeatRule,
        isActive: eventFromQuery.isActive,
        isOnline: eventFromQuery.isOnline,
        // wineSet: eventFromQuery.wineSet,
      })
    }
  }, [eventFromQuery, eventDataFromState, form])

  const onSubmit = async (formData: EventFormData) => {
    await updateEvent(formData)
  }

  return {
    form,
    // isSubmitting: isUpdating,
    // isLoading: isEventLoading,
    onSubmit,
    event: eventData,
  }
}
