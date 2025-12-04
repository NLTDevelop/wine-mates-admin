import { UseFormReturn } from 'react-hook-form'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { useTranslation } from 'react-i18next'
import { memo, useMemo, useEffect } from 'react'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { useCountryOptions } from '../../../presenters/useCountryOptions'
import { useRegionOptions } from '../../../presenters/useRegionOptions'

interface LocationSectionProps {
  form: UseFormReturn<WineFormData>
  countryValue: number | null
  regionValue?: number | null
}

export const LocationSection = memo(({ form, countryValue, regionValue }: LocationSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const countryId = form.watch('countryId')
  const regionId = form.watch('regionId')

  useEffect(() => {
    if (!countryValue && regionValue) {
      form.setValue('regionId', null)
    }
  }, [countryValue, regionValue, form])

  const { fetchOptions: fetchCountryOptions, isLoading: countriesLoading, countries = [] } = useCountryOptions({})

  const {
    fetchOptions: fetchRegionOptions,
    isLoading: regionsLoading,
    regions = [],
  } = useRegionOptions({
    countryId: countryValue,
  })

  const selectedCountry = useMemo(() => countries.find(c => c.id === countryId || Number(c.id) === countryId), [countries, countryId])

  const selectedRegion = useMemo(() => regions.find(r => r.id === regionId || Number(r.id) === regionId), [regions, regionId])

  const isRegionDisabled = useMemo(() => !countryValue, [countryValue])

  const countryOptions = useMemo(
    () =>
      countries.map(
        country =>
          ({
            value: country.id?.toString() || '',
            label: country.name || '',
          }) as IOption
      ),
    [countries]
  )

  const regionOptions = useMemo(
    () =>
      regions.map(
        region =>
          ({
            value: region.id?.toString() || '',
            label: region.name || '',
          }) as IOption
      ),
    [regions]
  )

  useEffect(() => {
    if (countryOptions.length > 0 && countryId) {
      form.setValue('countryId', countryId, { shouldValidate: true })
    }
  }, [countryOptions, countryId, form])

  useEffect(() => {
    if (regionOptions.length > 0 && regionId) {
      form.setValue('regionId', regionId, { shouldValidate: true })
    }
  }, [regionOptions, regionId, form])


  const countryPlaceholder = selectedCountry ? selectedCountry.name : countriesLoading ? tc('loading') : t('country_placeholder')

  const regionPlaceholder = selectedRegion ? selectedRegion.name : regionsLoading ? tc('loading') : t('region_placeholder')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormFieldCombobox
        form={form}
        formLabel={t('country')}
        name="countryId"
        placeholder={countryPlaceholder}
        searchLabel={tc('search')}
        fetchOptions={fetchCountryOptions}
        disabled={countriesLoading}
      />
      <FormFieldCombobox
        form={form}
        formLabel={t('region')}
        name="regionId"
        placeholder={regionPlaceholder}
        disabled={isRegionDisabled || regionsLoading}
        searchLabel={tc('search')}
        fetchOptions={fetchRegionOptions}
      />
    </div>
  )
})

LocationSection.displayName = 'LocationSection'
