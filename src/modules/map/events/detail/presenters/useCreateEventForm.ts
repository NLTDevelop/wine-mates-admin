import { useLocation } from 'react-router-dom'
import { useCreateEvent } from './useCreateEvent'
import { useEventForm } from './useEventForm'

export const useCreateEventForm = () => {
  const location = useLocation()
  const newEventLocation = location.state
  
  const form = useEventForm({ locationData: newEventLocation })
  const { createEvent, /*isCreating*/ } = useCreateEvent()

  const onSubmit = async (formData: any) => {
    console.log(formData)
    await createEvent(formData)
  }

  return {
    form,
    // isSubmitting: isCreating,
    onSubmit,
  }
}