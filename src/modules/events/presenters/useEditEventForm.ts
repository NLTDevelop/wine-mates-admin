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
    resolver: zodResolver(eventFormSchema()) as any,
    defaultValues: {
      theme: '',
      description: '',
      restaurantName: '',
      eventStartDate: '',
      eventEndDate: '',
      eventStartTime: '',
      eventEndTime: '',
      price: undefined,
      currency: 'UAH',
      speakerName: '',
      language: '',
      seats: undefined,
      phoneNumber: '',
      minAge: null,
      maxAge: null,
      sex: 'all',
      eventType: 'parties',
      tastingType: undefined,
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
        eventStartDate: event.eventStartDate?.split('T')[0] || '',
        eventEndDate: event.eventEndDate?.split('T')[0] || '',
        eventStartTime: event.eventStartTime || '',
        eventEndTime: event.eventEndTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || 'UAH',
        speakerName: event.speakerName || '',
        language: event.language || '',
        seats: event.seats.total || 1,
        phoneNumber: event.phoneNumber || '',
        minAge: (event as any).minAge ?? null,
        maxAge: (event as any).maxAge ?? null,
        sex: event.sex || 'all',
        eventType: event.eventType || 'parties',
        tastingType: event.tastingType || 'regular',
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
        eventStartDate: data.eventStartDate,
        eventEndDate: data.eventEndDate,
        eventStartTime: data.eventStartTime?.split(':').slice(0, 2).join(':') || '',
        eventEndTime: data.eventEndTime?.split(':').slice(0, 2).join(':') || '',
        price: data.price ? data.price : undefined,
        currency: data.currency,
        seats_total: data.seats.total,
        seats_left: data.seats.left,
        speakerName: data.speakerName,
        language: data.language as Language,
        phoneNumber: data.phoneNumber,
        minAge: data.minAge ?? undefined,
        maxAge: data.maxAge ?? undefined,
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
        eventStartDate: event.eventStartDate?.split('T')[0] || '',
        eventEndDate: event.eventEndDate?.split('T')[0] || '',
        eventStartTime: event.eventStartTime || '',
        eventEndTime: event.eventEndTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || 'UAH',
        speakerName: event.speakerName || '',
        language: event.language || '',
        seats: event.seats.total || 1,
        phoneNumber: event.phoneNumber || '',
        minAge: (event as any).minAge ?? null,
        maxAge: (event as any).maxAge ?? null,
        sex: event.sex || 'all',
        eventType: event.eventType || 'parties',
        tastingType: event.tastingType || 'regular',
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
