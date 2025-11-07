import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'

export const VintageSection = memo(({ form }: { form: UseFormReturn<WineFormData> }) => {
  const { t } = useTranslation('wines')
  const currentYear = new Date().getFullYear()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <YearPickerFormField form={form} name="vintageConfig" label={t('vintage_config')} placeholder={t('vintage_config')} required={true} fromYear={1900} toYear={currentYear} />
        <YearPickerFormField form={form} name="firstVintage" label={t('first_vintage')} placeholder={t('first_vintage')} required={false} fromYear={1900} toYear={currentYear} />
        <YearPickerFormField form={form} name="finalVintage" label={t('final_vintage')} placeholder={t('final_vintage')} required={false} fromYear={1900} toYear={currentYear} />
      </div>
    </>
  )
})

VintageSection.displayName = 'VintageSection'
