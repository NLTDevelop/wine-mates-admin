import { Button } from '@/UIKit/shadcn/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSelectDateForChart } from '../../../presenters/useSelectDateForChart'

interface SelectDateProps {
  chartRange: 'day' | 'month' | 'year'
  onChartRangeChange: (range: 'day' | 'month' | 'year') => void
  onDateChange: (date: string) => void
  selectedDate: string
  availableDates: string[]
}

export const SelectDate = ({ chartRange, onChartRangeChange, onDateChange, selectedDate, availableDates }: SelectDateProps) => {
  const { t } = useTranslation('analysis')

  const { filteredDates, formatDateForDisplay } = useSelectDateForChart({ chartRange, availableDates })

  return (
    <div className="border-b-0 py-3">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <TrendingUp className="h-5 w-5" />
        {t('dynamics')}
      </h3>
      <div className="flex flex-col md:flex-row gap-4 items-start sm:items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{t('period')}:</span>
          <div className="flex p-1 rounded-md bg-accent">
            {(['day', 'month', 'year'] as const).map(range => (
              <Button key={range} variant={chartRange === range ? 'primary' : 'outline'} size="sm" onClick={() => onChartRangeChange(range)} className="min-w-[60px] border-0">
                {range === 'day' && t('day')}
                {range === 'month' && t('month')}
                {range === 'year' && t('year')}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {chartRange === 'day' && `${t('date')}:`}
            {chartRange === 'month' && `${t('month')}:`}
            {chartRange === 'year' && `${t('year')}:`}
          </span>
          <Select value={selectedDate} onValueChange={onDateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{formatDateForDisplay(selectedDate, chartRange)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filteredDates.map(date => (
                <SelectItem key={date} value={date}>
                  {formatDateForDisplay(date, chartRange)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
