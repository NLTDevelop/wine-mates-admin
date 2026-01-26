import { memo, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useWineTypeOptions } from '../../../presenters/useWineTypeOptions'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { WineFormData } from '../../../presenters/wine-form-schema'

interface WineTypeSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  wineTypesLoading?: boolean
}

export const WineTypeSection = memo(
  ({ form, wineTypes, wineTypesLoading = false }: WineTypeSectionProps) => {
    const { t, i18n } = useTranslation('wines')
    const { t: tc } = useTranslation('common')

    const currentYear = new Date().getFullYear()
    const typeId = form.watch('typeId')

    const { fetchOptions } = useWineTypeOptions({
      cachedWineTypes: wineTypes,
      initialWineTypeId: typeId,
      onWineTypeChange: (value: string | null) => {
        const typeId = value ? parseInt(value, 10) : null
        form.setValue('typeId', typeId)
      },
    })

    const selectedType = useMemo(() => wineTypes.find(t => Number(t.id) === typeId), [wineTypes, typeId])

    const typeOptions = useMemo(
      () =>
        wineTypes.map(wt => {
          const currentLang = i18n.language.split('-')[0]
          const translation = wt.translations?.find(t => t.language === currentLang)

          let label = ''
          if (translation) {
            label = translation.name
          } else {
            const enTranslation = wt.translations?.find(t => t.language === 'en')
            label = enTranslation?.name || wt.translations?.[0]?.name || ''
          }

          return {
            value: wt.id?.toString() || '',
            label: label,
          } as IOption
        }),
      [wineTypes, i18n.language]
    )

    const getPlaceholder = useMemo(() => {
      if (wineTypesLoading) return tc('loading')

      if (selectedType) {
        const currentLang = i18n.language.split('-')[0]
        const translation = selectedType.translations?.find(t => t.language === currentLang)
        return translation?.name || selectedType.translations?.[0]?.name || t('wine_type_placeholder')
      }

      return t('wine_type_placeholder')
    }, [wineTypesLoading, tc, selectedType, i18n.language, t])

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldCombobox
          form={form}
          formLabel={t('wine_type') + '*'}
          name="typeId"
          placeholder={getPlaceholder}
          searchLabel={tc('search')}
          fetchOptions={fetchOptions}
          disabled={wineTypesLoading}
          options={typeOptions}
        />
        <YearPickerFormField form={form} name="vintage" label={t('vintage_config')} placeholder={t('vintage_config')} fromYear={1900} toYear={currentYear} />
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.form.watch('typeId') === nextProps.form.watch('typeId') &&
      prevProps.form.watch('vintage') === nextProps.form.watch('vintage') &&
      prevProps.wineTypes === nextProps.wineTypes &&
      prevProps.wineTypesLoading === nextProps.wineTypesLoading
    )
  }
)

WineTypeSection.displayName = 'WineTypeSection'
