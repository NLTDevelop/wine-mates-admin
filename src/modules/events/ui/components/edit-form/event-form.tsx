import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { Form } from '@/UIKit/shadcn/ui/form'
import {
  AgeSexSection,
  BasicInfoSection,
  DateTimeSection,
  DescriptionSection,
  PriceSeatsSection,
  RequiresConfirmationSection,
  SpeakerContactSection,
  TypeSettingsSection,
  WineSetSection,
} from './sections'
import { Button } from '@/UIKit/shadcn/ui/button'
import { IEvent } from '@/modules/events/entities/types/IEvent'

interface EventFormProps {
  form: UseFormReturn<EventFormData>
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  event?: IEvent
}

export const EventForm = ({ form, onSubmit, onCancel, isSubmitting = false, event }: EventFormProps) => {
  const { t } = useTranslation('common')

  const handleSubmit = (data: EventFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <DescriptionSection form={form} />
        {/* <DateTimeSection form={form} /> */}
        <PriceSeatsSection form={form} />
        <SpeakerContactSection form={form} />
        {/* <AgeSexSection form={form} /> */}
        <TypeSettingsSection form={form} />
        <RequiresConfirmationSection form={form} />
        <WineSetSection form={form} event={event} />

        <div className="flex gap-4 justify-between">
          <div className="flex-1" />
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('button.cancel')}
            </Button>

            <Button type="submit" className="min-w-32" disabled={isSubmitting}>
              {isSubmitting ? t('button.saving') : t('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
