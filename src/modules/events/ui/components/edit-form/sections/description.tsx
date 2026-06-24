import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { AutoSizeTextarea } from '@/UIKit/app-components/auto-size-textarea'

interface DescriptionSectionProps {
  form: UseFormReturn<EventFormData>
}

export const DescriptionSection = ({ form }: DescriptionSectionProps) => {
  const { t } = useTranslation('events')

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('description')}</FormLabel>
          <FormControl>
            <AutoSizeTextarea placeholder={t('description')} {...field} value={field.value || ''} onChange={field.onChange} className="w-full resize-none bg-background" />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
