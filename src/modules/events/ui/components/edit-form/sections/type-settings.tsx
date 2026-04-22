import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Wine, PartyPopper } from 'lucide-react'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { PARTICIPATION_CONDITION, REPEAT_RULES } from '@/modules/events/entities/types/constants'

interface TypeSettingsSectionProps {
  form: UseFormReturn<EventFormData>
}

const TASTING_OPTIONS = [
  { value: 'parties', icon: <PartyPopper className="h-4 w-4" />, label: 'parties' },
  { value: 'tastings', icon: <Wine className="h-4 w-4" />, label: 'tastings' },
]

export const TypeSettingsSection = ({ form }: TypeSettingsSectionProps) => {
  const { t } = useTranslation('events')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b border-accent pb-2">{t('type_settings')}</h2>

      <FormField
        control={form.control}
        name="eventType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-2">{t('event_type')} *</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                {TASTING_OPTIONS.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={field.value === option.value ? 'primary' : 'outline'}
                    onClick={() => field.onChange(option.value)}
                    className="flex items-center justify-center gap-1"
                  >
                    {option.icon}
                    <span className="text-xs">{t(`event_types.${option.label}`)}</span>
                  </Button>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="repeatRule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('repeat_rule')}</FormLabel>
              <Select key={field.value} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder={t('choose_option')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REPEAT_RULES.map(rule => (
                    <SelectItem key={rule} value={rule}>
                      {t(`repeat_rules.${rule}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participationCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('participation_condition')}</FormLabel>
              <Select key={field.value} onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder={t('choose_option')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PARTICIPATION_CONDITION.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {t(`participationCondition.${condition}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch className="mb-0" checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel>{t('active_event')}</FormLabel>
          </FormItem>
        )}
      />
    </div>
  )
}
