import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'

interface AgeSexSectionProps {
  form: UseFormReturn<EventFormData>
}

export const AgeSexSection = ({ form }: AgeSexSectionProps) => {
  const { t } = useTranslation('events')

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('age')}</FormLabel>
            <FormControl>
              <InputWithTooltip
                type="number"
                min="0"
                max="120"
                placeholder={t('age')}
                {...field}
                onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                value={field.value || ''}
                error={form.formState.errors.age?.message as string}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('sex')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-11 bg-background">
                  <SelectValue placeholder={t('choose_option')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="all">{t('all_gender')}</SelectItem>
                <SelectItem value="male">{t('male')}</SelectItem>
                <SelectItem value="female">{t('female')}</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  )
}
