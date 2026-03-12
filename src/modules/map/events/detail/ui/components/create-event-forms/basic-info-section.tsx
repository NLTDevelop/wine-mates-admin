import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

interface BasicInfoSectionProps {
  form: UseFormReturn<EventFormData>
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const { t } = useTranslation('events')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b border-accent pb-2">{t('basic_info')}</h2>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{t('theme')} *</FormLabel>
                <FormControl>
                  <InputWithTooltip placeholder={t('theme') + '...'} {...field} error={form.formState.errors.theme?.message as string} />
                </FormControl>
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="restaurantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('restaurant_name')} *</FormLabel>
              <FormControl>
                <InputWithTooltip placeholder={t('restaurant_name') + '...'} {...field} error={form.formState.errors.restaurantName?.message as string} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
