import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { AlertCircle } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { IMaskInput } from 'react-imask'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { AVAILABLE_LANGUAGES } from '@/constatnts/avialable-languages'
import { cn } from '@/lib/utils'

interface SpeakerContactSectionProps {
  form: UseFormReturn<EventFormData>
}

export const SpeakerContactSection = ({ form }: SpeakerContactSectionProps) => {
  const { t } = useTranslation('events')

  const { errors } = form.formState

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
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>{t('language')} *</FormLabel>
              <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={cn(errors.language ? 'border-red-500 ring-red-500' : '', 'w-full h-11 bg-background')}>
                    <SelectValue placeholder={t('choose_option')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.filter((lang, index, self) => index === self.findIndex(l => l.name === lang.name)).map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormLabel>{t('phone') + '*'}</FormLabel>
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
