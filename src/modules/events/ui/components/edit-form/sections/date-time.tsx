import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/UIKit/shadcn/ui/form'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { DatePicker } from '@/UIKit/app-components/date-picker'

interface DateTimeSectionProps {
  form: UseFormReturn<EventFormData>
}

export const DateTimeSection = ({ form }: DateTimeSectionProps) => {
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
                <DatePicker
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder={t('date.select_date')}
                  minDate={new Date()}
                  maxDate={new Date('2100-12-31')}
                  error={form.formState.errors.eventDate?.message as string}
                />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
