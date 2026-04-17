import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'

interface RequiresConfirmationSectionProps {
  form: UseFormReturn<EventFormData>
}

export const RequiresConfirmationSection = ({ form }: RequiresConfirmationSectionProps) => {
  const { t } = useTranslation('events')

  return (
    <FormField
      control={form.control}
      name="requiresConfirmation"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel>{t('requires_confirmation')}</FormLabel>
        </FormItem>
      )}
    />
  )
}
