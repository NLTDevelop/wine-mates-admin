import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { TASTING_TYPES, REPEAT_RULES } from '../../../../entities/types'
import { Wine, Combine, Eye } from 'lucide-react'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'

interface TypeSettingsSectionProps {
  form: UseFormReturn<EventFormData>
}

const TASTING_TYPE_CONFIG = {
  wine_set: { icon: <Wine className="h-4 w-4" />, label: 'wine_set' },
  comparative: { icon: <Combine className="h-4 w-4" />, label: 'comparative' },
  blind: { icon: <Eye className="h-4 w-4" />, label: 'blind' },
}

export const TypeSettingsSection: React.FC<TypeSettingsSectionProps> = ({ form }) => {
  const { t } = useTranslation('events')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b border-accent pb-2">{t('type_settings')}</h2>

      <FormField
        control={form.control}
        name="tastingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-2">{t('tasting_type')} *</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-2">
                {TASTING_TYPES.map(type => (
                  <Button key={type} type="button" variant={field.value === type ? 'primary' : 'outline'} onClick={() => field.onChange(type)} className="flex items-center justify-center gap-1">
                    {TASTING_TYPE_CONFIG[type].icon}
                    <span className="text-xs">{t(`tasting_types.${type}`)}</span>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
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
      </div>
      <FormField
        control={form.control}
        name="isOnline"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch className="mb-0" checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel>{t('online_event')}</FormLabel>
          </FormItem>
        )}
      />

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
