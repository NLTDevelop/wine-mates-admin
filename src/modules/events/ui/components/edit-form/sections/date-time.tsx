import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/UIKit/shadcn/ui/form'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { DatePicker } from '@/UIKit/app-components/date-picker'

interface DateTimeSectionProps {
  form: UseFormReturn<EventFormData>
}

export const DateTimeSection = ({ form }: DateTimeSectionProps) => {
  const { t } = useTranslation('events')

  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="eventStartDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('start_date')} *</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={t('start_date')}
                minDate={new Date()}
                maxDate={new Date('2100-12-31')}
                error={form.formState.errors.eventStartDate?.message as string}
                isCompact
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="eventEndDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('end_date')} *</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || ''}
                onChange={field.onChange}
                placeholder={t('end_date')}
                minDate={new Date()}
                maxDate={new Date('2100-12-31')}
                error={form.formState.errors.eventEndDate?.message as string}
                isCompact
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="eventStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('start_time')} *</FormLabel>
              <FormControl>
                <input type="time" value={field.value || ''} onChange={field.onChange} className="w-full rounded-xl border border-border h-11 px-3 text-sm focus:outline-none bg-background" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventEndTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('end_time')} *</FormLabel>
              <FormControl>
                <input type="time" value={field.value || ''} onChange={field.onChange} className="w-full rounded-xl border border-border h-11 px-3 text-sm focus:outline-none  bg-background" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
