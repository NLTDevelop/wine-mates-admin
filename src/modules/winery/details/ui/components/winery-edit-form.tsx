/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Form } from '@/UIKit/shadcn/ui/form'
import { FormFieldCombobox, IOption } from '@/UIKit/app-components/form-field-combobox'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'
import { NLTFormField } from '@/UIKit/components/NLTFormField'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { useRegionOptions } from '@/modules/wine/create-wine/presenters/useRegionOptions'
import { IWineryDetail } from '../../entities/types'
import { useEditWineryForm } from '../../presenters/useEditWineryForm'
import { WineryEditFormData, WineryEditFormValues } from '../../presenters/winery-edit-schema'

interface WineryProfileFormProps {
  form: UseFormReturn<WineryEditFormValues, object, WineryEditFormData>
  onSubmit: (data: WineryEditFormData) => Promise<void>
  onCancel: () => void
  onReset: () => void
  isSubmitting?: boolean
  hasChanges?: boolean
}

interface EditWineryFormProps {
  winery: IWineryDetail
  onSuccess?: () => void
  onCancel: () => void
}

const WineryProfileForm = ({ form, onSubmit, onCancel, onReset, isSubmitting = false, hasChanges = true }: WineryProfileFormProps) => {
  const { t } = useTranslation('winery')
  const { t: tc } = useTranslation('common')

  const countryId = form.watch('countryId')
  const { fetchOptions: fetchCountryOptions, isLoading: countriesLoading, countries = [] } = useCountryOptions({})
  const {
    fetchOptions: fetchRegionOptions,
    isLoading: regionsLoading,
    regions = [],
  } = useRegionOptions({
    countryId: countryId ? Number(countryId) : null,
  })

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'countryId') {
        form.setValue('regionId', null)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const countryOptions = useMemo<IOption[]>(
    () =>
      countries.map(country => ({
        value: country.id.toString(),
        label: country.name,
      })),
    [countries]
  )

  const regionOptions = useMemo<IOption[]>(
    () =>
      regions.map(region => ({
        value: region.id.toString(),
        label: region.name,
      })),
    [regions]
  )

  const handleSubmit = (data: WineryEditFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="rounded-t-none bg-input/50">
          <CardContent className="space-y-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NLTFormField form={form} name="name" formLabel={t('form.winery_name')} placeholder={t('form.winery_name_placeholder')} required />
              <YearPickerFormField
                form={form}
                name="foundedYear"
                label={t('form.founded_year')}
                placeholder={t('form.founded_year_placeholder')}
                fromYear={1000}
                toYear={new Date().getFullYear()}
                required
              />
              <FormFieldCombobox
                form={form}
                formLabel={t('form.winery_country')}
                name="countryId"
                placeholder={countriesLoading ? tc('loading') : t('form.winery_country_placeholder')}
                searchLabel={tc('search')}
                fetchOptions={fetchCountryOptions}
                options={countryOptions}
                disabled={countriesLoading}
                showX={false}
              />
              <FormFieldCombobox
                form={form}
                formLabel={t('form.region')}
                name="regionId"
                placeholder={regionsLoading ? tc('loading') : t('form.region_placeholder')}
                searchLabel={tc('search')}
                fetchOptions={fetchRegionOptions}
                options={regionOptions}
                disabled={!countryId || regionsLoading}
              />
              <div className="md:col-span-2">
                <NLTFormField
                  form={form}
                  name="description"
                  formLabel={t('form.description')}
                  placeholder={t('form.description_placeholder')}
                  textArea
                  textAreaMinHeight={140}
                  maxLength={3000}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <NLTFormField form={form} name="links" formLabel={t('form.links')} placeholder={t('form.links_placeholder')} textArea textAreaMinHeight={96} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 md:flex-row flex-col justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('button.go_detail')}
          </Button>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onReset} disabled={!hasChanges || isSubmitting} className="flex-1">
              {tc('button.cancel')}
            </Button>
            <Button type="submit" className="min-w-32 flex-1" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? tc('button.saving') : tc('button.save')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export const EditWineryForm = ({ winery, onSuccess, onCancel }: EditWineryFormProps) => {
  const { form, isSubmitting, hasChanges, onSubmit, resetForm } = useEditWineryForm({ winery, onSuccess })

  return <WineryProfileForm form={form} onSubmit={onSubmit} onCancel={onCancel} onReset={resetForm} isSubmitting={isSubmitting} hasChanges={hasChanges} />
}
