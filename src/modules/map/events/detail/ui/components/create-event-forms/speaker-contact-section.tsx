import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { LANGUAGES } from '../../../../entities/types'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'
import { AlertCircle } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { IMaskInput } from 'react-imask'
interface SpeakerContactSectionProps {
  form: UseFormReturn<EventFormData>
}

export const SpeakerContactSection: React.FC<SpeakerContactSectionProps> = ({ form }) => {
  const { t } = useTranslation('events')

  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="speakerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('speaker_name')}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} placeholder={t('speaker_name') + '...'} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('language')} *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-11  border px-3 text-base shadow-sm transition-colors rounded-md input-focus  placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-background text-foreground border-input w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => {
          const error = form.formState.errors.phoneNumber?.message as string
          const maskValue = field.value ? field.value : ''
          return (
            <FormItem>
              <FormLabel>{t('phone')} *</FormLabel>
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
    </div>
  )
}
