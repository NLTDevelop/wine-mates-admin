import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/shadcn/use-toast'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { EventFormData, eventFormSchema } from './event-form-schema'
import { eventQueries } from '../entities/event-queries'
import { eventsService } from '../entities/events-service'
import { Language } from '../entities/types/constants'
import { IWineSetResponse } from '../entities/types/wine-set.dto'
import { PATHS } from '@/navigation/paths'

export const useEditEventForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation('events')
  const queryClient = useQueryClient()

  const { data: eventResponse, isLoading } = useQuery({
    ...eventQueries.detail(id!),
    enabled: !!id,
  })

  const event = eventResponse?.data

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      theme: '',
      description: '',
      restaurantName: '',
      eventDate: '',
      eventTime: '',
      price: undefined,
      currency: 'UAH',
      speakerName: '',
      language: '',
      seats: undefined,
      phoneNumber: '',
      age: null,
      sex: 'all',
      eventType: 'parties',
      requiresConfirmation: false,
      repeatRule: 'never',
      isActive: false,
      wineSet: [],
    },
  })

  useEffect(() => {
    if (event) {
      const wineSetFormatted =
        event.wineSet?.map((item: IWineSetResponse) => ({
          wineId: item.wine.id,
          sortOrder: item.sortOrder,
        })) || []

      form.reset({
        theme: event.theme || '',
        description: event.description || '',
        restaurantName: event.restaurantName || '',
        eventDate: event.eventDate?.split('T')[0] || '',
        eventTime: event.eventTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || 'UAH',
        speakerName: event.speakerName || '',
        language: event.language || '',
        seats: event.seats || 1,
        phoneNumber: event.phoneNumber || '',
        age: (event as any).age ?? null,
        sex: event.sex || 'all',
        eventType: event.eventType || 'parties',
        requiresConfirmation: event.requiresConfirmation || false,
        repeatRule: event.repeatRule || 'never',
        participationCondition: event.participationCondition || undefined,
        isActive: event.isActive || false,
        wineSet: wineSetFormatted,
      })
    }
  }, [event, form])

  const updateMutation = useMutation({
    mutationFn: (data: EventFormData) => {
      const updateData = {
        theme: data.theme,
        description: data.description,
        restaurantName: data.restaurantName,
        eventDate: data.eventDate,
        eventTime: data.eventTime?.split(':').slice(0, 2).join(':') || '',
        price: data.price ? data.price : undefined,
        currency: data.currency,
        seats: data.seats,
        speakerName: data.speakerName,
        language: data.language as Language,
        phoneNumber: data.phoneNumber,
        age: data.age ?? undefined,
        sex: data.sex,
        eventType: data.eventType,
        requiresConfirmation: data.requiresConfirmation,
        repeatRule: data.repeatRule,
        participationCondition: data.participationCondition || undefined,
        isActive: data.isActive,
        wineSet: data.wineSet,
      }

      return eventsService.update({ id: Number(id), data: updateData })
    },
    onSuccess: () => {
      toast({ title: t('event_updated'), variant: 'default' })
      queryClient.invalidateQueries({ queryKey: ['events', 'detail', id] })
      queryClient.removeQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', 'list'] })
      navigate(PATHS.EVENTS_LIST)
    },
  })

  const onSubmit = async (data: EventFormData) => {
    await updateMutation.mutateAsync(data)
  }

  const resetForm = () => {
    if (event) {
      const wineSetFormatted =
        event.wineSet?.map((item: IWineSetResponse) => ({
          wineId: item.wine.id,
          sortOrder: item.sortOrder,
        })) || []

      form.reset({
        theme: event.theme || '',
        description: event.description || '',
        restaurantName: event.restaurantName || '',
        eventDate: event.eventDate?.split('T')[0] || '',
        eventTime: event.eventTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || 'UAH',
        speakerName: event.speakerName || '',
        language: event.language || '',
        seats: event.seats || 1,
        phoneNumber: event.phoneNumber || '',
        age: (event as any).age ?? null,
        sex: event.sex || 'all',
        eventType: event.eventType || 'parties',
        requiresConfirmation: event.requiresConfirmation || false,
        repeatRule: event.repeatRule || 'never',
        participationCondition: event.participationCondition || undefined,
        isActive: event.isActive || false,
        wineSet: wineSetFormatted,
      })
    }
  }

  return {
    form,
    event,
    isLoading,
    isSubmitting: updateMutation.isPending,
    onSubmit,
    resetForm,
  }
}
