import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'

export const ProducerInfoSection = ({ form }: { form: UseFormReturn<WineFormData> }) => {
  const { t } = useTranslation('wines')

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('display_name') + '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('display_name_placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="producerTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('producer_title') + '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('producer_title_placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="producerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('producer_name') + '*'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('producer_name_placeholder')} />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder={t('wine_name_placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
