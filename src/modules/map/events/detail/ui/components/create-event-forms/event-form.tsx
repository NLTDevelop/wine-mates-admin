import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Form } from '@/UIKit/shadcn/ui/form'
import { LocationInfo } from './location-info'
import { WineItem } from '../../../../entities/types'
import { EventFormData } from '../../../presenters/event-form-schema'
import { BasicInfoSection } from './basic-info-section'
import { DateTimeSection } from './date-time-section'
import { PriceSeatsSection } from './price-seats-section'
import { SpeakerContactSection } from './speaker-contact-section'
import { TypeSettingsSection } from './type-settings-section'

interface EventFormProps {
  form: UseFormReturn<EventFormData>
  mode: 'create' | 'edit'
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  wines?: WineItem[]
  hasChanges?: boolean
}

export const EventForm: React.FC<EventFormProps> = ({
  form,
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
//   wines,
  hasChanges = true,
}) => {
  const { t } = useTranslation('common')
  const { t: te } = useTranslation('events')

  const handleSubmit = (data: EventFormData) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const isEditMode = mode === 'edit'
  const canSubmit = !isEditMode || (isEditMode && hasChanges)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <LocationInfo form={form} />
        <BasicInfoSection form={form} />
        <DateTimeSection form={form} />
        <PriceSeatsSection form={form} />
        <SpeakerContactSection form={form} />
        <TypeSettingsSection form={form} />
        {/* <WinesSection form={form} wines={wines} /> */}

        <div className={`flex gap-4 md:flex-row flex-col ${mode !== 'create' ? 'justify-between' : 'justify-end'}`}>
          {mode === 'edit' && onCancel && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              {te('button.go_to_event')}
            </Button>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {t('button.cancel')}
            </Button>

            <Button type="submit" className="min-w-32" disabled={isSubmitting || !canSubmit}>
              {isSubmitting
                ? mode === 'create'
                  ? t('button.creating')
                  : t('button.saving')
                : mode === 'create'
                ? t('button.create')
                : t('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}