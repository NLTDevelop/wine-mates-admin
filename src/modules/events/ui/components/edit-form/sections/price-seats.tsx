import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
// import { CURRENCIES } from '@/modules/events/entities/types/constants'
import { cn } from '@/lib/utils'

interface PriceSeatsSectionProps {
  form: UseFormReturn<EventFormData>
}

export const PriceSeatsSection = ({ form }: PriceSeatsSectionProps) => {
  const { t } = useTranslation('events')

  const { errors } = form.formState

  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{t('price')}</FormLabel>
              <FormControl>
                <InputWithTooltip
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t('price') + '...'}
                  {...field}
                  onChange={e => {
                    const value = e.target.value === '' ? null : parseFloat(e.target.value)
                    field.onChange(value)
                  }}
                  value={field.value === null || field.value === undefined ? '' : field.value}
                  error={form.formState.errors.price?.message as string}
                />
              </FormControl>
            </FormItem>
          )
        }}
      />

      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('currency')} *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn(
                    errors.language ? 'border-red-500 ring-red-500' : '',
                    'h-11 border px-3 text-base shadow-sm transition-colors rounded-md input-focus placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-background text-foreground border-input w-full'
                  )}
                >
                  <SelectValue placeholder={t('choose_option')} />
                </SelectTrigger>
              </FormControl>
              {/* <SelectContent>
                {CURRENCIES.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent> */}
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seats"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('seats')} *</FormLabel>
            <FormControl>
              <InputWithTooltip
                type="number"
                step="1"
                min="1"
                placeholder={t('seats') + '...'}
                {...field}
                onChange={e => {
                  const value = e.target.value
                  if (value === '') {
                    field.onChange(undefined)
                  } else {
                    field.onChange(parseInt(value, 10))
                  }
                }}
                value={field.value === undefined ? '' : field.value}
                error={form.formState.errors.seats?.message as string}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
