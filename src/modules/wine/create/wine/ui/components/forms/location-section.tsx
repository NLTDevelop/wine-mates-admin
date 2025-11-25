import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { memo, useMemo, useEffect } from 'react'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'

interface LocationSectionProps {
  form: UseFormReturn<WineFormData>
  countryValue: string[]
  regionValue?: string[]
}

export const LocationSection = memo(({ form, countryValue, regionValue }: LocationSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  useEffect(() => {
    if (!countryValue && regionValue) {
      form.setValue('region', '')
    }
  }, [countryValue, regionValue, form])

  useEffect(() => {
    if (!regionValue && form.watch('subRegion')) {
      form.setValue('subRegion', '')
    }
  }, [regionValue, form])

  const isRegionDisabled = useMemo(() => !countryValue, [countryValue])
  const isSubRegionDisabled = useMemo(() => !regionValue, [regionValue])

  const regionError = useMemo(() => {
    const country = form.watch('country')
    const region = form.watch('region')
    const isRegionTouched = form.formState.touchedFields.region
    if (!isRegionTouched) {
      return
    }

    if (country && !region) {
      return "Регіон обов'язковий при виборі країни"
    }
    return form.formState.errors.region?.message as string
  }, [form.watch('country'), form.watch('region'), form.formState.touchedFields.region])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormFieldCombobox
        form={form}
        formLabel={t('country') + '*'}
        name="country"
        placeholder={t('country_placeholder')}
        searchLabel={tc('search')}
        fetchOptions={async (search?: string) => {
          await new Promise(resolve => setTimeout(resolve, 300))

          const allCountries = [
            { value: 'uk', label: 'Україна' },
            { value: 'fr', label: 'Франція' },
            { value: 'it', label: 'Італія' },
            { value: 'es', label: 'Іспанія' },
            { value: 'de', label: 'Німеччина' },
            { value: 'us', label: 'США' },
          ]

          if (search) {
            return allCountries.filter(country => country.label.toLowerCase().includes(search.toLowerCase()))
          }

          return allCountries
        }}
      />
      <FormFieldCombobox
        form={form}
        formLabel={t('region') + '*'}
        name="region"
        disabled={isRegionDisabled}
        error={regionError}
        placeholder={t('region_placeholder')}
        searchLabel={tc('search')}
        fetchOptions={async () => {
          return [
            { value: '1', label: 'Регіон ' },
            { value: '2', label: 'Регіон ' },
            { value: '3', label: 'Регіон ' },
            { value: '4', label: 'Регіон ' },
            { value: '5', label: 'Регіон ' },
          ]
        }}
        options={[
          { value: '1', label: 'Регіон' },
          { value: '2', label: 'Регіон' },
          { value: '3', label: 'Регіон' },
          { value: '4', label: 'Регіон' },
          { value: '5', label: 'Регіон' },
        ]}
      />
      <FormFieldCombobox
        form={form}
        formLabel={t('sub_region')}
        name="subRegion"
        placeholder={t('sub_region_placeholder')}
        disabled={isSubRegionDisabled}
        searchLabel={tc('search')}
        fetchOptions={async () => {
          return [
            { value: '1', label: 'СубРегіон ' },
            { value: '2', label: 'СубРегіон ' },
            { value: '3', label: 'СубРегіон ' },
            { value: '4', label: 'СубРегіон ' },
            { value: '5', label: 'СубРегіон ' },
          ]
        }}
        options={[
          { value: '1', label: 'СубРегіон ' },
          { value: '2', label: 'СубРегіон ' },
          { value: '3', label: 'СубРегіон ' },
          { value: '4', label: 'СубРегіон ' },
          { value: '5', label: 'СубРегіон ' },
        ]}
      />
    </div>
  )
})

LocationSection.displayName = 'LocationSection'
