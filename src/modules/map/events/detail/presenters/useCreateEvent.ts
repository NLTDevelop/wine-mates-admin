import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/navigation/paths'
import { EventFormData } from './event-form-schema'

export const useCreateEvent = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation('events')

  //   const createEventMutation = useMutation({
  //     ...eventQueries.create(),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['events'] })
  //       toast({
  //         title: t('event_created'),
  //         variant: 'default',
  //       })
  //       navigate(PATHS.MAP)
  //     },
  //     onError: (error) => {
  //       toast({
  //         title: t('error_creating_event'),
  //         description: error.message,
  //         variant: 'destructive',
  //       })
  //     },
  //   })

  const createEvent = async (eventData: EventFormData) => {
    console.log(eventData)
    // return createEventMutation.mutateAsync(eventData)
  }

  return {
    createEvent,
    // isCreating: createEventMutation.isPending,
  }
}
