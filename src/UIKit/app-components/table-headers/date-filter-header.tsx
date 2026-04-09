import { Button } from '@/UIKit/shadcn/ui/button'
import { Calendar } from '@/UIKit/shadcn/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

interface DateFilterHeaderProps {
  column: string
  label: string
  onFilter: (column: string, value: any) => void
  currentFrom?: string | null
  currentTo?: string | null
}

export const DateFilterHeader = ({ column, label, onFilter, currentFrom, currentTo }: DateFilterHeaderProps) => {
  const { t } = useTranslation('common')

  const today = new Date()
  const currentYear = today.getFullYear()

  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>({
    from: currentFrom ? new Date(currentFrom) : today,
    to: currentTo ? new Date(currentTo) : undefined,
  })

  const [isOpen, setIsOpen] = useState(false)

  const hasTempSelection = !!(tempDateRange?.from || tempDateRange?.to)

  const isFilterActive = !!(currentFrom || currentTo)

  useEffect(() => {
    if (isOpen) {
      setTempDateRange({
        from: currentFrom ? new Date(currentFrom) : today,
        to: currentTo ? new Date(currentTo) : undefined,
      })
    }
  }, [isOpen, currentFrom, currentTo])

  const handleApply = () => {
    onFilter(column, {
      dateFrom: tempDateRange?.from ? format(tempDateRange.from, 'yyyy-MM-dd') : null,
      dateTo: tempDateRange?.to ? format(tempDateRange.to, 'yyyy-MM-dd') : null,
    })

    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTempDateRange({ from: undefined, to: undefined })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus-visible:ring-transparent active:bg-transparent active:border-none p-0 font-medium ${isFilterActive ? 'text-primary' : ''}`}
        >
          <span className="flex gap-2 text-sm">
            {label}
            <CalendarIcon className={`h-4 w-4 ${isFilterActive ? 'text-primary' : ''}`} />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-[#2e2e38] shadow-lg rounded-md border" align="start">
        <div className="p-2">
          <Calendar
            mode="range"
            selected={tempDateRange}
            onSelect={setTempDateRange}
            numberOfMonths={1}
            locale={uk}
            weekStartsOn={1}
            autoFocus={true}
            startMonth={new Date(currentYear - 1, 0)}
            endMonth={new Date(currentYear + 5, 11)}
            captionLayout="dropdown"
            className="rounded-md border-0"
            formatters={{
              formatMonthDropdown: date => date.toLocaleString('uk-UA', { month: 'long' }).replace('.', ''),
            }}
          />

          {hasTempSelection && (
            <div className={cn('flex gap-2 mt-2', hasTempSelection && 'pt-2 border-t border-gray-200')}>
              <div className="flex-1">
                <Button size="sm" variant="delete" onClick={handleClear} className="h-5">
                  <X className="h-3 w-3 mr-1" />
                  {t('button.clear')}
                </Button>
              </div>
              <Button size="sm" className="h-5" onClick={handleApply}>
                {t('button.apply')}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
