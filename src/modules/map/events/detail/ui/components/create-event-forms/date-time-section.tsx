import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

interface DateTimeSectionProps {
  form: UseFormReturn<EventFormData>
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({ form }) => {
  const { t } = useTranslation('events')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="whitespace-nowrap w-16">{t('date')} *</FormLabel>
              <FormControl>
                <InputWithTooltip
                  type="date"
                  {...field}
                  value={field.value || ''}
                  className="w-full"
                  min={new Date().toISOString().split('T')[0]}
                  max="2100-12-31"
                  error={form.formState.errors.eventDate?.message as string}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="whitespace-nowrap w-16">{t('time')} *</FormLabel>
              <FormControl>
                <InputWithTooltip type="time" {...field} value={field.value || ''} className="w-full" error={form.formState.errors.eventTime?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
