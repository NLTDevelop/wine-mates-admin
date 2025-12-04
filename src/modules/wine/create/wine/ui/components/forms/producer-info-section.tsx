import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'
import { adaptFetchOptions } from '@/lib/utils'
import { useCallback } from 'react'
import i18n from 'i18next'

interface ProducerInfoSectionProps {
  form: UseFormReturn<WineFormData>
  colors: BaseWineColor[]
  colorsLoading: boolean
}

export const ProducerInfoSection = ({ form, colors, colorsLoading }: ProducerInfoSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const colorId = form.watch('colorId')

  const selectedColor = colors.find(c => Number(c.id) === colorId)
  const currentLanguage = i18n.language

  const displayValue = selectedColor ? selectedColor.translations?.find(t => t.language === currentLanguage)?.name || selectedColor.translations?.[0]?.name || '' : ''

  const fetchOptions = useCallback(
    async (search?: string) => {
      const fetchFn = async (searchParam?: string) => {
        if (!searchParam?.trim()) {
          return colors
        }

        const term = searchParam.toLowerCase()
        return colors.filter(color => color.translations?.some(t => t.name.toLowerCase().includes(term)))
      }

      return adaptFetchOptions(fetchFn)(search)
    },
    [colors]
  )

  const placeholder = selectedColor ? displayValue : colorsLoading ? tc('loading') : t('color_wine')

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
        <FormFieldCombobox form={form} formLabel={t('color_wine') + '*'} name="colorId" placeholder={placeholder} searchLabel={tc('search')} fetchOptions={fetchOptions} disabled={colorsLoading} />
      </div>
    </>
  )
}
