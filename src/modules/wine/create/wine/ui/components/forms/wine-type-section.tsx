import { memo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'

interface WineTypeSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  mode: 'create' | 'edit'
}

export const WineTypeSection = memo(
  ({ form /*wineTypes*/ }: WineTypeSectionProps) => {
    const { t } = useTranslation('wines')
    const { t: tc } = useTranslation('common')

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldCombobox
            form={form}
            formLabel={t('wine_type') + '*'}
            name="type"
            placeholder={t('wine_type_placeholder')}
            searchLabel={tc('search')}
            fetchOptions={async () => {
              return [
                { value: '1', label: 'Червоне' },
                { value: '2', label: 'Біле' },
                { value: '3', label: 'Рожеве' },
                { value: '4', label: 'Ігристе' },
                { value: '5', label: 'Помаранчере' },
              ]
            }}
            options={[
              { value: '1', label: 'Червоне' },
              { value: '2', label: 'Біле' },
              { value: '3', label: 'Рожеве' },
              { value: '4', label: 'Ігристе' },
              { value: '5', label: 'Помаранчере' },
            ]}
          />

          <FormField
            control={form.control}
            name="subType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sub_type')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('sub_type_placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.form.watch('type') === nextProps.form.watch('type') && prevProps.wineTypes === nextProps.wineTypes
  }
)

WineTypeSection.displayName = 'WineTypeSection'
