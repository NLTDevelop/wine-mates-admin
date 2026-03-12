import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { EventFormData } from './event-form-schema'
import { PATHS } from '@/navigation/paths'
import { MapEvent } from '../../entities/types'

export const useUpdateEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation('events')

  // const updateEventMutation = useMutation({
  //   ...eventQueries.update(Number(id)),
  //   onSuccess: (updatedEvent: MapEvent) => {
  //     queryClient.invalidateQueries({ queryKey: ['events'] })
  //     queryClient.invalidateQueries({ queryKey: ['events', Number(id)] })
      
  //     toast({
  //       title: t('event_updated'),
  //       description: t('event_updated_description'),
  //       variant: 'default',
  //     })

  //     navigate(PATHS.MAP)
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: t('error_updating_event'),
  //       description: error.message,
  //       variant: 'destructive',
  //     })
  //   },
  // })

  const updateEvent = async (eventData: EventFormData) => {
    console.log(eventData)
    // return updateEventMutation.mutateAsync(eventData)
  }

  return {
    updateEvent,
    // isUpdating: updateEventMutation.isPending,
  }
}