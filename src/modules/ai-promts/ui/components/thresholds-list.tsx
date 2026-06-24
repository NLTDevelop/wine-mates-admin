import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FIXED_THRESHOLDS } from '../../entities/constants'
import { GeminiConfig } from '../../presenters/useAiPromtForm'
import { FormField, FormItem, FormLabel, FormControl } from '@/UIKit/shadcn/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'

interface ThresholdsListProps {
  form: UseFormReturn<GeminiConfig>
  disabled?: boolean
}

export const ThresholdsList = ({ form, disabled }: ThresholdsListProps) => {
  const { t } = useTranslation('promt')
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('thresholds')}</FormLabel>
        <span className="text-sm text-muted-foreground">{t('thresholds_qty')}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIXED_THRESHOLDS.map((threshold, index) => (
          <Card key={threshold.name} className="flex flex-col h-full !p-0 bg-accent-foreground/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-3 flex-1">
              <CardTitle className="text-sm text-foreground/80  font-medium">{threshold.description}</CardTitle>
            </CardHeader>

            <CardContent className="pt-2  flex-1 flex flex-col justify-end">
              <FormField control={form.control} name={`thresholds.${index}.name`} render={({ field }) => <input type="hidden" {...field} value={threshold.name} />} />
              <FormField control={form.control} name={`thresholds.${index}.description`} render={({ field }) => <input type="hidden" {...field} value={threshold.description} />} />
              <FormField
                control={form.control}
                name={`thresholds.${index}.value`}
                render={({ field, fieldState }) => {
                  return (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs">{t('value')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <InputWithTooltip
                            type="number"
                            step={threshold.name.includes('RATIO') ? '0.01' : '0.01'}
                            {...field}
                            min="0"
                            {...field}
                            onChange={e => {
                              const value = e.target.value
                              if (value === '') {
                                field.onChange(undefined)
                              } else {
                                field.onChange(parseFloat(value))
                              }
                            }}
                            value={field.value ?? ''}
                            disabled={disabled}
                            className="text-center h-12 text-lg font-mono"
                            error={fieldState.error?.message}
                            placeholder={t('entry_value')}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <p className="text-[10px] text-foreground mt-2 font-bold">{threshold.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
