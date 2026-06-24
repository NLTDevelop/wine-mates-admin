import { EndConditionType, Frequency, RepeatRuleConfig } from '@/modules/events/entities/types/constants'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Label } from '@/UIKit/shadcn/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { RadioGroup, RadioGroupItem } from '@/UIKit/shadcn/ui/ui/radio-group'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { Calendar } from '@/UIKit/shadcn/ui/calendar'
import { uk } from 'date-fns/locale'

export const CustomRepeatSettings = ({ initialValue, onSave }: { initialValue: RepeatRuleConfig | null; onSave: (rule: RepeatRuleConfig) => void }) => {
  const { t } = useTranslation('events')
  const [frequency, setFrequency] = useState<Frequency>(initialValue?.frequency || 'day')
  const [interval, setInterval] = useState<number>(initialValue?.interval || 1)
  const [weekDays, setWeekDays] = useState<number[]>(initialValue?.weekDays || [])
  const [endType, setEndType] = useState<EndConditionType>(initialValue?.endCondition.type || 'never')
  const [endValue, setEndValue] = useState<string | number>(initialValue?.endCondition.value || format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    if (endType === 'count' && typeof endValue !== 'number') {
      setEndValue(1)
    }
    if (endType === 'date' && typeof endValue !== 'string') {
      setEndValue(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [endType])

  const weekDaysLabels = [
    { label: 'ПН', id: 1 },
    { label: 'ВТ', id: 2 },
    { label: 'СР', id: 3 },
    { label: 'ЧТ', id: 4 },
    { label: 'ПТ', id: 5 },
    { label: 'СБ', id: 6 },
    { label: 'ВС', id: 0 },
  ]

  const handleSave = () => {
    const rule: RepeatRuleConfig = {
      frequency,
      interval,
      weekDays,
      endCondition: {
        type: endType,
        ...(endType === 'count' && { value: Number(endValue) }),
        ...(endType === 'date' && { value: endValue as string }),
      },
    }
    onSave(rule)
  }

  const intervalOptions = Array.from({ length: 30 }, (_, i) => i + 1)

  const getCalendarDate = (val: string | number): Date | undefined => {
    if (!val || typeof val !== 'string') return undefined
    const parsed = Date.parse(val)
    return isNaN(parsed) ? new Date() : new Date(parsed)
  }

  const getFrequencyTranslation = (frequency: string, interval: number): string => {
    const getPluralForm = (num: number): string => {
      if (num === 1) return 'one'
      if (num >= 2 && num <= 4) return 'two'
      return 'few'
    }

    const pluralForm = getPluralForm(interval)

    switch (frequency) {
      case 'day':
        return t(`repeat_rules.day_${pluralForm}`)
      case 'week':
        return t(`repeat_rules.week_${pluralForm}`)
      case 'month':
        return t(`repeat_rules.month_${pluralForm}`)
      case 'year':
        return t(`repeat_rules.year_${pluralForm}`)
      default:
        return frequency
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-secondary">
          <p className="mb-1">{t('repeat_interval')}</p>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Select value={String(interval)} onValueChange={v => setInterval(Number(v))}>
            <SelectTrigger className="rounded-xl border-border h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map(num => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={frequency} onValueChange={v => setFrequency(v as Frequency)}>
            <SelectTrigger className="rounded-xl border-border h-11 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{getFrequencyTranslation('day', interval)}</SelectItem>
              <SelectItem value="week">{getFrequencyTranslation('week', interval)}</SelectItem>
              <SelectItem value="month"> {getFrequencyTranslation('month', interval)}</SelectItem>
              <SelectItem value="year">{getFrequencyTranslation('year', interval)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-secondary">
          <p className="mb-1">{t('days_repetition')}</p>
        </Label>
        <div className="flex justify-between gap-1">
          {weekDaysLabels.map(day => {
            const isSelected = weekDays.includes(day.id)
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setWeekDays(weekDays.filter(d => d !== day.id))
                  } else {
                    setWeekDays([...weekDays, day.id].sort())
                  }
                }}
                className={`w-9 h-9 text-xs font-semibold rounded-full transition-colors flex items-center justify-center
                    ${isSelected ? 'bg-primary text-white' : 'bg-[#F9ECEC] text-primary hover:bg-[#F3DADA]'}`}
              >
                {day.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-5">
        <Label className="text-sm font-medium">
          <p className="mb-1">{t('the_end')}</p>
        </Label>

        <RadioGroup value={endType} onValueChange={v => setEndType(v as EndConditionType)} className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="never" className="border-gray-300 text-secondary" />
              <Label htmlFor="never" className="text-sm font-normal cursor-pointer select-none">
                {t('repeat_rules.never')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="date" id="date" className="border-gray-300 text-secondary" />
              <Label htmlFor="date" className="text-sm font-normal cursor-pointer select-none">
                {t('repeat_rules.until_date')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="count" id="count" className="border-gray-300 text-secondary" />
              <Label htmlFor="count" className="text-sm font-normal cursor-pointer select-none">
                {t('repeat_rules.after_n_times')}
              </Label>
            </div>
          </div>

          {(endType === 'date' || endType === 'count') && (
            <div className="pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {endType === 'date' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full rounded-xl border-gray-200 h-11 px-3 text-left font-normal flex justify-between items-center bg-white hover:bg-gray-50',
                        !endValue && 'text-muted-foreground'
                      )}
                    >
                      {endValue && typeof endValue === 'string' ? format(parseISO(endValue), 'dd.MM.yyyy') : <span>{t('pick_date')}</span>}
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 bg-white rounded-2xl shadow-xl border border-border" align="center">
                    <Calendar
                      mode="single"
                      selected={getCalendarDate(endValue)}
                      locale={uk}
                      onSelect={date => {
                        if (date) {
                          setEndValue(format(date, 'yyyy-MM-dd'))
                        }
                      }}
                      captionLayout="dropdown"
                      className="rounded-md border-0 w-full"
                      startMonth={new Date()}
                      endMonth={new Date(new Date().getFullYear() + 5, 11)}
                    />
                  </PopoverContent>
                </Popover>
              )}
              {endType === 'count' && (
                <label
                  className="flex items-center w-full rounded-xl border border-border h-11 bg-white px-3 
      cursor-text transition-all"
                >
                  <input
                    type="number"
                    min={1}
                    step={1}
                    max={999}
                    value={endValue}
                    onKeyDown={e => {
                      if (['.', ',', 'e', 'E', '-', '+'].includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    onChange={e => {
                      const val = e.target.value
                      if (val === '') {
                        setEndValue('')
                      } else {
                        setEndValue(Math.floor(Number(val)))
                      }
                    }}
                    style={{
                      width: endValue ? `${Math.max(String(endValue).length * 10 + 8, 40)}px` : '40px',
                    }}
                    className="h-full bg-transparent border-0 p-0 text-sm font-medium outline-none focus:ring-0 
        shrink-0 min-w-0
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="1"
                  />

                  <span className="text-sm text-secondary select-none ml-1.5 truncate min-w-0">{t(Number(endValue) < 5 ? 'repetition_single' : 'repetition_plural')}</span>
                </label>
              )}
            </div>
          )}
        </RadioGroup>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} disabled={frequency === 'week' && weekDays.length === 0} className="w-full">
          {t('button.save')}
        </Button>
      </div>
    </div>
  )
}
