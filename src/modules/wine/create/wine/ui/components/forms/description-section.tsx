import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'

export const DescriptionSection = ({ form }: { form: UseFormReturn<WineFormData> }) => {
  const { t } = useTranslation('wines')

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('description')}</FormLabel>
          <FormControl>
            <Textarea {...field} placeholder={t('description_placeholder')} className="min-h-[100px] bg-background" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
