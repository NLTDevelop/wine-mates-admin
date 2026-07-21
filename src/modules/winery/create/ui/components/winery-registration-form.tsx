import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/UIKit/shadcn/ui/form'
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
import { IMaskInput } from 'react-imask'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { AlertCircle } from 'lucide-react'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('form.email')} *</FormLabel>
                        <FormControl>
                          <InputWithTooltip placeholder={t('form.email_placeholder')} {...field} error={form.formState.errors.email?.message as string} />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('form.password')} *</FormLabel>
                        <FormControl>
                          <InputWithTooltip type="password" placeholder={t('form.password_placeholder')} {...field} error={form.formState.errors.password?.message as string} />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => {
                    const error = form.formState.errors.phoneNumber?.message as string
                    return (
                      <FormItem>
                        <FormLabel>{t('form.phone_number') + '*'}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IMaskInput
                              mask="+38 (000) 000-00-00"
                              value={field.value || ''}
                              onAccept={(value: any) => field.onChange(value)}
                              onBlur={field.onBlur}
                              lazy={false}
                              placeholder="+38 (___) ___-__-__"
                              className="h-11 border px-3 text-base shadow-sm transition-colors rounded-md input-focus placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-background text-foreground border-input w-full"
                            />
                            {error && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <NLTTooltip delay={500} message={error} className="bg-red-500 max-w-75" trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />
                              </div>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
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
                          minDate={new Date(1926, 0, 1)}
                          maxDate={new Date()}
                          error={form.formState.errors.birthday?.message as string}
                          isCompact
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('form.winery_section')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('form.winery_name')} *</FormLabel>
                        <FormControl>
                          <InputWithTooltip placeholder={t('form.winery_name_placeholder') + '...'} {...field} error={form.formState.errors.name?.message as string} />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
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
