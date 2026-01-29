import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'

interface ProducerInfoSectionProps {
  form: UseFormReturn<WineFormData>
}

export const ProducerInfoSection = ({ form }: ProducerInfoSectionProps) => {
  const { t } = useTranslation('wines')

  const currentYear = new Date().getFullYear()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('table.winename') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('display_name_placeholder')} error={form.formState.errors.name?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="producer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('table.producertitle')}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('producer_title_placeholder')} error={form.formState.errors.producer?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="grapeVariety"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('grape_variety')}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('grape_variety_placeholder')} error={form.formState.errors.grapeVariety?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
        <YearPickerFormField form={form} name="vintage" label={t('vintage_config')} placeholder={t('vintage_config')} fromYear={1900} toYear={currentYear} />
      </div>
    </>
  )
}
