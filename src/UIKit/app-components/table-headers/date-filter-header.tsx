import { Button } from '@/UIKit/shadcn/ui/button'
import { Calendar } from '@/UIKit/shadcn/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { CalendarIcon, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

interface DateFilterHeaderProps {
  column: string
  label: string
  onFilter?: (column: string, value: any) => void
  currentFrom?: string | null
  currentTo?: string | null
  onSort?: (column?: string) => void
  sortBy?: string
  sortOrder?: string
}

export const DateFilterHeader = ({ column, label, onFilter, currentFrom, currentTo, onSort, sortBy, sortOrder }: DateFilterHeaderProps) => {
  const { t } = useTranslation('wines')

  const today = new Date()
  const currentYear = today.getFullYear()

  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>({
    from: currentFrom ? new Date(currentFrom) : today,
    to: currentTo ? new Date(currentTo) : undefined,
  })

  const [isOpen, setIsOpen] = useState(false)

  const hasTempSelection = !!(tempDateRange?.from || tempDateRange?.to)
  const isFilterActive = !!(currentFrom || currentTo)
  const hasFilter = !!onFilter
  const hasSort = !!onSort
  const isSorted = sortBy?.startsWith(column)
  const isActive = (hasFilter && isFilterActive) || (hasSort && isSorted)

  const getSortIcon = () => {
    if (!hasSort) return null
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />
    return sortBy?.endsWith('_asc') || sortOrder === 'asc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
  }

  const getIcon = () => {
    if (hasSort && isSorted) {
      return getSortIcon()
    }
    if (hasFilter && isFilterActive) {
      return <CalendarIcon className="h-4 w-4 text-primary" />
    }
    if (hasSort) {
      return getSortIcon()
    }
    return <CalendarIcon className="h-4 w-4" />
  }

  const handleApply = useCallback(() => {
    if (onFilter) {
      onFilter(column, {
        dateFrom: tempDateRange?.from ? format(tempDateRange.from, 'yyyy-MM-dd') : null,
        dateTo: tempDateRange?.to ? format(tempDateRange.to, 'yyyy-MM-dd') : null,
      })
    }
    setIsOpen(false)
  }, [onFilter, column, tempDateRange])

  const handleClearFilter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setTempDateRange({ from: undefined, to: undefined })
      if (onFilter) {
        onFilter(column, {
          dateFrom: null,
          dateTo: null,
        })
      }
    },
    [onFilter, column]
  )

  const handleClearSort = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onSort) {
        onSort(undefined)
      }
    },
    [onSort]
  )

  const handleSort = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!onSort) return
      onSort(column)
    },
    [onSort, column]
  )

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasFilter && hasSort) {
        e.preventDefault()
        handleSort(e)
      }
    },
    [hasFilter, hasSort, handleSort]
  )

  if (!hasFilter) {
    return (
      <Button
        variant="ghost"
        onClick={handleSort}
        className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus-visible:ring-transparent active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
      >
        <span className="flex gap-2 text-sm items-center">
          {label}
          {getIcon()}
        </span>
      </Button>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild onClick={handleTriggerClick}>
        <Button
          variant="ghost"
          className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus-visible:ring-transparent active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
        >
          <span className="flex gap-2 text-sm items-center">
            {label}
            {getIcon()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-[#2e2e38] shadow-lg rounded-md border" align="start">
        <div className="p-2">
          {hasSort && (
            <>
              <div className="py-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
                <span>{t('sorting')}</span>
                {isSorted && (
                  <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearSort}>
                    <X className="h-3 w-3 mr-1" />
                    {t('clear')}
                  </Button>
                )}
              </div>

              <Button variant="ghost" className="w-full justify-start bg-input h-8 py-1.5 text-sm hover:bg-input" onClick={handleSort}>
                <div className="mx-auto flex items-center gap-2 text-foreground">
                  {getSortIcon()}
                  <span>{t('sort_by')}</span>
                </div>
              </Button>

              <div className="border-t border-gray-200 my-2" />
            </>
          )}

          <div className="mb-1.5 text-sm font-semibold text-muted-foreground flex items-center justify-between">
            <span>{t('filtering')}</span>
            {isFilterActive && (
              <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClearFilter}>
                <X className="h-3 w-3 mr-1" />
                {t('clear')}
              </Button>
            )}
          </div>

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
                <Button size="sm" variant="delete" onClick={handleClearFilter} className="h-5">
                  <X className="h-3 w-3 mr-1" />
                  {t('clear')}
                </Button>
              </div>
              <Button size="sm" className="h-5" onClick={handleApply}>
                {t('apply')}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
