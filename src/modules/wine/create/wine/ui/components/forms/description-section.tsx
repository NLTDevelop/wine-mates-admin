import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'

interface DescriptionSectionProps {
  form: UseFormReturn<WineFormData>
  mode: 'create' | 'edit'
}
export const DescriptionSection = ({ form }: DescriptionSectionProps) => {
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
