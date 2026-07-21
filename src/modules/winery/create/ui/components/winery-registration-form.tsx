/* eslint-disable react/react-in-jsx-scope */
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { DatePicker } from '@/UIKit/app-components/date-picker'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'
import { YearPickerFormField } from '@/UIKit/app-components/year-picker-form-field'
import { NLTFormField } from '@/UIKit/components/NLTFormField'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { useRegionOptions } from '@/modules/wine/create-wine/presenters/useRegionOptions'
import { WineryRegistrationFormData, WineryRegistrationFormValues } from '../../presenters/winery-registration-schema'
import { useEffect } from 'react'

interface WineryRegistrationFormProps {
  form: UseFormReturn<WineryRegistrationFormValues, object, WineryRegistrationFormData>
  onSubmit: (data: WineryRegistrationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export const WineryRegistrationForm = ({ form, onSubmit, onCancel, isSubmitting = false }: WineryRegistrationFormProps) => {
  const { t } = useTranslation('winery')
  const { t: tc } = useTranslation('common')

  const wineryCountryId = form.watch('wineryCountryId')
  const { fetchOptions: fetchCountryOptions, isLoading: countriesLoading } = useCountryOptions({})
  const { fetchOptions: fetchRegionOptions, isLoading: regionsLoading } = useRegionOptions({
    countryId: wineryCountryId ? Number(wineryCountryId) : null,
  })

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'wineryCountryId') {
        form.setValue('regionId', null)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = (data: WineryRegistrationFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="rounded-t-none bg-input/50">
          <CardContent className="space-y-6 sm:px-0">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('form.owner_section')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NLTFormField form={form} name="email" formLabel={t('form.email')} type="email" placeholder={t('form.email_placeholder')} required />
                <NLTFormField form={form} name="password" formLabel={t('form.password')} type="password" placeholder={t('form.password_placeholder')} required />
                <NLTFormField form={form} name="phoneNumber" formLabel={t('form.phone_number')} type="tel" placeholder={t('form.phone_number_placeholder')} required />
                <FormFieldCombobox
                  form={form}
                  formLabel={t('form.user_country')}
                  name="userCountryId"
                  placeholder={countriesLoading ? tc('loading') : t('form.user_country_placeholder')}
                  searchLabel={tc('search')}
                  fetchOptions={fetchCountryOptions}
                  disabled={countriesLoading}
                  showX={false}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('form.birthday')} *</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder={t('form.birthday_placeholder')}
                          maxDate={new Date()}
                          error={form.formState.errors.birthday?.message as string}
                          isCompact
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('form.winery_section')}</h2>
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
                  name="wineryCountryId"
                  placeholder={countriesLoading ? tc('loading') : t('form.winery_country_placeholder')}
                  searchLabel={tc('search')}
                  fetchOptions={fetchCountryOptions}
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
                  disabled={!wineryCountryId || regionsLoading}
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
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 md:flex-row flex-col">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {tc('button.cancel')}
          </Button>
          <Button type="submit" className="min-w-32" disabled={isSubmitting}>
            {isSubmitting ? tc('button.creating') : tc('button.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
