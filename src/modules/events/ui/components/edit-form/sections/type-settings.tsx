import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Wine, PartyPopper, Settings, Calendar } from 'lucide-react'
import { EventFormData } from '@/modules/events/presenters/event-form-schema'
import { PARTICIPATION_CONDITION, RepeatRuleConfig } from '@/modules/events/entities/types/constants'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/UIKit/shadcn/ui/dialog'
import { CustomRepeatSettings } from './custom-settings-modal'
import { useEventStore } from '@/modules/events/entities/events-store'
import { useEventFilters } from '@/modules/events/presenters/useEventFilters'

interface TypeSettingsSectionProps {
  form: UseFormReturn<EventFormData>
}

export const getRepeatRuleFromPreset = (preset: string): RepeatRuleConfig | null => {
  switch (preset) {
    case 'daily':
      return {
        frequency: 'day',
        interval: 1,
        endCondition: { type: 'never' },
      }
    case 'weekly':
      return {
        frequency: 'week',
        interval: 1,
        weekDays: [],
        endCondition: { type: 'never' },
      }
    case 'monthly':
      return {
        frequency: 'month',
        interval: 1,
        endCondition: { type: 'never' },
      }
    case 'yearly':
      return {
        frequency: 'year',
        interval: 1,
        endCondition: { type: 'never' },
      }
    default:
      return null
  }
}

const getPresetRepeatRule = (rule?: RepeatRuleConfig | null): string => {
  if (!rule) return 'never'
  if (rule.frequency === 'day' && rule.interval === 1 && rule.endCondition.type === 'never') return 'daily'
  if (rule.frequency === 'week' && rule.interval === 1 && !rule.weekDays?.length && rule.endCondition.type === 'never') return 'weekly'
  if (rule.frequency === 'month' && rule.interval === 1 && rule.endCondition.type === 'never') return 'monthly'
  if (rule.frequency === 'year' && rule.interval === 1 && rule.endCondition.type === 'never') return 'yearly'
  return 'custom'
}

const EVENT_OPTIONS = [
  { value: 'parties', icon: <PartyPopper className="h-4 w-4" />, label: 'parties' },
  { value: 'tastings', icon: <Wine className="h-4 w-4" />, label: 'tastings' },
]

export const TypeSettingsSection = ({ form }: TypeSettingsSectionProps) => {
  const { t } = useTranslation('events')
  const { tempRepeatRule, setTempRepeatRule, clearTempRepeatRule } = useEventStore()
  const { getTastingTypeFilterOptions } = useEventFilters()

  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>(() => {
    const currentRepeatRule = tempRepeatRule || form.watch('repeatRule')
    return getPresetRepeatRule(currentRepeatRule)
  })


  useEffect(() => {
    if (tempRepeatRule) {
      const preset = getPresetRepeatRule(tempRepeatRule)
      setSelectedPreset(preset)
      form.setValue('repeatRule', tempRepeatRule)
    }
  }, [tempRepeatRule, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'repeatRule') {
        const rule = value.repeatRule
        const preset = getPresetRepeatRule(rule === undefined ? null : (rule as RepeatRuleConfig | null))
        setSelectedPreset(preset)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    const rule = form.getValues('repeatRule')
    if (rule) {
      const preset = getPresetRepeatRule(rule)
      if (preset !== selectedPreset) {
        setSelectedPreset(preset)
      }
    }
  }, [form.getValues('repeatRule')])

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)

    if (preset === 'never') {
      form.setValue('repeatRule', null)
      clearTempRepeatRule()
    } else if (preset === 'custom') {
      setIsCustomDialogOpen(true)
    } else {
      const repeatRule = getRepeatRuleFromPreset(preset)
      form.setValue('repeatRule', repeatRule)
      clearTempRepeatRule()
    }
  }

  const handleCustomRepeatRule = (rule: RepeatRuleConfig) => {
    form.setValue('repeatRule', rule)
     setTempRepeatRule(rule)
    setSelectedPreset('custom')
    setIsCustomDialogOpen(false)
  }

  const getRepeatRuleDisplayText = () => {
    const rule = tempRepeatRule || form.watch('repeatRule')
    if (!rule) return t('repeat_rules.never')

    if (rule.frequency === 'day' && rule.interval === 1 && rule.endCondition.type === 'never') {
      return t('repeat_rules.daily')
    }
    if (rule.frequency === 'week' && rule.interval === 1 && rule.endCondition.type === 'never') {
      return t('repeat_rules.weekly')
    }
    if (rule.frequency === 'month' && rule.interval === 1 && rule.endCondition.type === 'never') {
      return t('repeat_rules.monthly')
    }
    if (rule.frequency === 'year' && rule.interval === 1 && rule.endCondition.type === 'never') {
      return t('repeat_rules.yearly')
    }
    return t('repeat_rules.custom')
  }

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
                {EVENT_OPTIONS.map(option => (
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
      <FormField
        control={form.control}
        name="tastingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-2">{t('tasting_type')} *</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                {getTastingTypeFilterOptions().map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={field.value === option.value ? 'secondary' : 'outline'}
                    onClick={() => field.onChange(option.value)}
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="text-xs">{t(option.label)}</span>
                  </Button>
                ))}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 ">
          <FormLabel>{t('repeat_rule')}</FormLabel>
          <div className="flex">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{getRepeatRuleDisplayText()}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">{t('repeat_rules.never')}</SelectItem>
                <SelectItem value="daily">{t('repeat_rules.daily')}</SelectItem>
                <SelectItem value="weekly">{t('repeat_rules.weekly')}</SelectItem>
                <SelectItem value="monthly">{t('repeat_rules.monthly')}</SelectItem>
                <SelectItem value="yearly">{t('repeat_rules.yearly')}</SelectItem>
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('repeat_rules.custom')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {selectedPreset === 'custom' && (
              <Button type="button" variant="ghost" className="h-11 w-11 text-muted-foreground ml-1" onClick={() => setIsCustomDialogOpen(true)}>
                <Settings className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
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

      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('custom_repeat_settings')}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <CustomRepeatSettings
            initialValue={form.watch('repeatRule')}
            onSave={rule => {
              setTempRepeatRule(rule)
              handleCustomRepeatRule(rule)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
