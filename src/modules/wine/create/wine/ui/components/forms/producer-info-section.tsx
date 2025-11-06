import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

export const ProducerInfoSection = ({ form }: { form: UseFormReturn<WineFormData> }) => {
  const { t } = useTranslation('wines')

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('display_name') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('display_name_placeholder')} error={form.formState.errors.displayName?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('wine_name') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('wine_name_placeholder')} error={form.formState.errors.wine?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grapeVariety"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('grape_variety') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('grape_variety_placeholder')} error={form.formState.errors.grapeVariety?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="producerTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('producer_title') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('producer_title_placeholder')} error={form.formState.errors.producerTitle?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="producerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('producer_name') + '*'}</FormLabel>
              <FormControl>
                <InputWithTooltip {...field} placeholder={t('producer_name_placeholder')} error={form.formState.errors.producerName?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
