import { memo, useCallback, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { useWineTypeOptions } from '../../../presenters/useWineTypeOptions'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { adaptFetchOptions } from '@/lib/utils'

interface TypeColorSectionSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  wineTypesLoading?: boolean
  colors: BaseWineColor[]
  colorsLoading: boolean
}

export const TypeColorSection = memo(
  ({ form, wineTypes, wineTypesLoading = false, colors, colorsLoading }: TypeColorSectionSectionProps) => {
    const { t, i18n } = useTranslation('wines')
    const { t: tc } = useTranslation('common')

    const colorId = form.watch('colorId')

    const selectedColor = colors.find(c => Number(c.id) === colorId)
    const currentLanguage = i18n.language

    const displayValue = selectedColor ? selectedColor.translations?.find(t => t.language === currentLanguage)?.name || selectedColor.translations?.[0]?.name || '' : ''

    const fetchOptionsColor = useCallback(
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

    const placeholder = selectedColor ? displayValue : colorsLoading ? tc('loading') : t('color_wine')

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
        <FormFieldCombobox
          form={form}
          formLabel={t('color_wine') + '*'}
          name="colorId"
          placeholder={placeholder}
          searchLabel={tc('search')}
          fetchOptions={fetchOptionsColor}
          disabled={colorsLoading}
        />
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.form.watch('typeId') === nextProps.form.watch('typeId') &&
      prevProps.form.watch('colorId') === nextProps.form.watch('colorId') &&
      prevProps.wineTypes === nextProps.wineTypes &&
      prevProps.wineTypesLoading === nextProps.wineTypesLoading
    )
  }
)

TypeColorSection.displayName = 'TypeColorSection'
