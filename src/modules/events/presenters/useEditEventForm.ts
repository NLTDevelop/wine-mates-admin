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
import { Language, RepeatRuleConfig } from '../entities/types/constants'
import { IWineSetResponse } from '../entities/types/wine-set.dto'
import { PATHS } from '@/navigation/paths'
import { useEventStore } from '../entities/events-store'
import { getRepeatRuleFromPreset } from '../ui/components/edit-form/sections'
import { format } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'

const convertToUTC = (date: string, time: string): { date: string; time: string } => {
  if (!date || !time) return { date, time }
  const timeZone = 'Europe/Kiev'
  const localDateTime = new Date(`${date}T${time}`)

  const utcDate = fromZonedTime(localDateTime, timeZone)

  return {
    date: format(utcDate, 'yyyy-MM-dd'),
    time: format(utcDate, 'HH:mm:ss'),
  }
}

export const useEditEventForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation('events')
  const queryClient = useQueryClient()
  const { clearTempRepeatRule, setTempRepeatRule, tempRepeatRule } = useEventStore()

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
      currency: '',
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
      repeatRule: null,
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

      let repeatRuleValue = null
      if (event.repeatRule) {
        if (typeof event.repeatRule === 'object') {
          repeatRuleValue = event.repeatRule as RepeatRuleConfig
          console.log('tempRepeatRule update 1->', repeatRuleValue)
          setTempRepeatRule(repeatRuleValue)
        } else if (typeof event.repeatRule === 'string' && event.repeatRule !== 'never') {
          repeatRuleValue = getRepeatRuleFromPreset(event.repeatRule)
        }
      }

      form.reset({
        theme: event.theme || '',
        description: event.description || '',
        restaurantName: event.restaurantName || '',
        eventStartDate: event.eventStartDate?.split('T')[0] || '',
        eventEndDate: event.eventEndDate?.split('T')[0] || '',
        eventStartTime: event.eventStartTime || '',
        eventEndTime: event.eventEndTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || '',
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
        repeatRule: repeatRuleValue,
        participationCondition: event.participationCondition || undefined,
        isActive: event.isActive || false,
        wineSet: wineSetFormatted,
      })
    }
  }, [event, form, setTempRepeatRule])

  const updateMutation = useMutation({
    mutationFn: (data: EventFormData) => {
      const startUTC = convertToUTC(data.eventStartDate, data.eventStartTime)
      const endUTC = convertToUTC(data.eventEndDate, data.eventEndTime)
      const updateData = {
        theme: data.theme,
        description: data.description,
        restaurantName: data.restaurantName,
        eventStartDate: startUTC.date,
        eventStartTime: startUTC.time,
        eventEndDate: endUTC.date,
        eventEndTime: endUTC.time,
        price: data.price ? data.price : undefined,
        currency: data.currency,
        seats: data.seats,
        speakerName: data.speakerName,
        language: data.language as Language,
        phoneNumber: data.phoneNumber,
        minAge: data.minAge ?? undefined,
        maxAge: data.maxAge ?? undefined,
        sex: data.sex,
        eventType: data.eventType,
        tastingType: data.tastingType,
        requiresConfirmation: data.requiresConfirmation,
        repeatRule: data.repeatRule || null,
        participationCondition: data.participationCondition || undefined,
        isActive: data.isActive,
        wineSet: data.wineSet,
      }

      return eventsService.update({ id: Number(id), data: updateData })
    },
    onSuccess: () => {
      toast({ title: t('event_updated'), variant: 'default' })
      queryClient.invalidateQueries({ queryKey: ['events', 'list'] })
      queryClient.removeQueries({ queryKey: ['events'] })
      navigate(PATHS.EVENTS_LIST)
    },
  })

  const onSubmit = async (data: EventFormData) => {
    await updateMutation.mutateAsync(data)
    clearTempRepeatRule()
  }

  const resetForm = () => {
    if (event) {
      const wineSetFormatted =
        event.wineSet?.map((item: IWineSetResponse) => ({
          wineId: item.wine.id,
          sortOrder: item.sortOrder,
        })) || []

      let repeatRuleValue = null
      if (event.repeatRule) {
        if (typeof event.repeatRule === 'object') {
          repeatRuleValue = event.repeatRule as RepeatRuleConfig
          console.log('tempRepeatRule reset 2->', repeatRuleValue)
          setTempRepeatRule(repeatRuleValue)
        } else if (typeof event.repeatRule === 'string' && event.repeatRule !== 'never') {
          repeatRuleValue = getRepeatRuleFromPreset(event.repeatRule)
        }
      }

      form.reset({
        theme: event.theme || '',
        description: event.description || '',
        restaurantName: event.restaurantName || '',
        eventStartDate: event.eventStartDate?.split('T')[0] || '',
        eventEndDate: event.eventEndDate?.split('T')[0] || '',
        eventStartTime: event.eventStartTime || '',
        eventEndTime: event.eventEndTime || '',
        price: event.price ? Number(event.price) : null,
        currency: event.currency || '',
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
        repeatRule: repeatRuleValue,
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
