import { memo, useCallback, useEffect, useMemo } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'
import { useWineTypeOptions } from '../../../presenters/useWineTypeOptions'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { MultiSelect } from '@/UIKit/shadcn/ui/multi-select'
import { useAromaForm } from '../../../presenters/useAromaForm'
import { mockWineTypes } from '@/modules/wine/create/wine-types/entities/mock'

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
    const aromaIds = form.watch('aromaIds') || []

    const selectedType = useMemo(() => wineTypes.find(t => Number(t.id) === typeId), [wineTypes, typeId])

    const watchedTypeId = useWatch({
      control: form.control,
      name: 'typeId',
    })

    useEffect(() => {
      if (watchedTypeId !== undefined && watchedTypeId !== null) {
        // const newSelectedType = wineTypes.find(t => Number(t.id) === Number(watchedTypeId))
        //mock
        const newSelectedType = {
          id: 110,
          isSparkling: false,
          sortNumber: 2,
          translations: Array(3),
          aromas: [
            { id: 19, name: 'Бульбашки' },
            { id: 20, name: 'Яблуко' },
          ],
        }

        if (newSelectedType?.aromas) {
          const newAromaIds = newSelectedType.aromas.map(a => (a?.id ? Number(a.id) : undefined)).filter((id): id is number => id !== undefined)
          form.setValue('aromaIds', newAromaIds)
        } else {
          form.setValue('aromaIds', [])
        }
      }
    }, [watchedTypeId, wineTypes, form])

    const handleWineTypeChange = useCallback(
      (value: string | null) => {
        const newTypeId = value ? parseInt(value, 10) : null
        form.setValue('typeId', newTypeId)
      },
      [form]
    )

    const { fetchOptions } = useWineTypeOptions({
      cachedWineTypes: wineTypes,
      initialWineTypeId: typeId,
      onWineTypeChange: handleWineTypeChange,
    })

    const handleAromasChange = useCallback(
      (newAromaIds: number[]) => {
        form.setValue('aromaIds', newAromaIds)
      },
      [form]
    )

    const {
      aromasValues,
      handleAromaChange,
      fetchOptions: fetchAromaOptions,
    } = useAromaForm({
      //   cachedAromas: selectedType?.aromas || [],
      cachedAromas: [
        { id: '19', name: 'Бульбашки' },
        { id: '20', name: 'Яблуко' },
      ],
      initialAromaIds: /*aromaIds*/ [19, 20],
      onAromasChange: handleAromasChange,
    })

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

    const aromasValuesForMultiselect = aromasValues.map(id => id.toString())

    return (
      <>
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
        <div className="space-y-2 ">
          <label className="text-sm font-medium mb-2 block">{t('types.aromas')} *</label>
          <MultiSelect
            value={aromasValuesForMultiselect}
            onChange={handleAromaChange}
            placeholder={t('types.aromas')}
            searchLabel={t('types.aromas')}
            fetchOptions={fetchAromaOptions}
            mode="multiple"
            disabled={!selectedType?.aromas?.length || wineTypesLoading}
          />
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">{t('types.flavor_notes')} *</label>
          <MultiSelect
            value={colorValues}
            onChange={handleColorChange}
            placeholder={t('flavors.choose_color')}
            searchLabel={t('flavors.search_color')}
            fetchOptions={fetchOptions}
            mode="multiple"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium mb-2 block">{t('types.flavor_characteristics')} *</label>
          <MultiSelect
            value={colorValues}
            onChange={handleColorChange}
            placeholder={t('flavors.choose_color')}
            searchLabel={t('flavors.search_color')}
            fetchOptions={fetchOptions}
            mode="multiple"
            disabled={isLoading}
          />
        </div> */}
      </>
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
