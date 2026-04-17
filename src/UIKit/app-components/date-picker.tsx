import { Button } from '@/UIKit/shadcn/ui/button'
import { Calendar } from '@/UIKit/shadcn/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  error?: string
}

export const DatePicker = ({ value, onChange, placeholder, disabled, minDate, maxDate, error }: DatePickerProps) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const selectedDate = value ? new Date(value) : undefined
  const today = new Date()
  const currentYear = today.getFullYear()

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'))
    } else {
      onChange('')
    }
    setOpen(false)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal h-11 border px-3 text-base shadow-sm transition-colors rounded-md input-focus placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-background text-foreground border-input',
              !value && 'text-muted-foreground',
              error && 'border-red-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), 'dd.MM.yyyy') : <span>{placeholder || t('date.select_date')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg rounded border bg-popover" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={uk}
            weekStartsOn={1}
            autoFocus={true}
            startMonth={minDate || new Date(currentYear - 1, 0)}
            endMonth={maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth()) : new Date(currentYear + 5, 11)}
            captionLayout="dropdown"
            className="rounded border-0 w-full"
            disabled={date => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
            formatters={{
              formatMonthDropdown: date => date.toLocaleString('uk-UA', { month: 'long' }).replace('.', ''),
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
