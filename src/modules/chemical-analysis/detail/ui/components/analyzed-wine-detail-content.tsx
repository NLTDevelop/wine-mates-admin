import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { CharacteristicsHistoryResponse, IChemicalMeasure, IWineAnalysisDetail } from '../../entities/types'
import { CharacteristicsCharts } from './chemical-detail/characteristics-charts'
import { ChemicalIndicatorCard } from './chemical-detail/chemical-indicator-card'
import { useTranslation } from 'react-i18next'
import { AdditionIndicatorCard } from './chemical-detail/addition-indicator-card'
import { Activity, Droplets, Flame, Layers, Wind } from 'lucide-react'

interface AnalyzedWineDetailContentProps {
  analyzedWine: IWineAnalysisDetail
  currentSnapshot: {
    sugarContent: IChemicalMeasure[]
    ph: IChemicalMeasure[]
    volatileAcidity: IChemicalMeasure[]
    totalAcidity: IChemicalMeasure[]
    alcohol: IChemicalMeasure[]
    freeSO2: number
    totalSO2: number
    density: number
    malolactic: boolean
    fermentationTemp: number
  }
  chartData?: CharacteristicsHistoryResponse
  selectedDate: string
  availableDates: string[]
  chartRange: 'day' | 'month' | 'year'
  onDateChange: (date: string) => void
  onChartRangeChange: (range: 'day' | 'month' | 'year') => void
}

export const AnalyzedWineDetailContent: React.FC<AnalyzedWineDetailContentProps> = ({ currentSnapshot, chartData, selectedDate, availableDates, chartRange, onDateChange, onChartRangeChange }) => {
  const { t } = useTranslation('analysis')

  const formatDateForDisplay = (dateStr: string, range: 'day' | 'month' | 'year'): string => {
    const date = new Date(dateStr)

    switch (range) {
      case 'day':
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      case 'month':
        return date.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })
      case 'year':
        return date.getFullYear().toString()
      default:
        return dateStr
    }
  }

  const getFilteredDates = () => {
    if (chartRange === 'day') {
      return availableDates
    }

    const uniqueDates = new Set<string>()

    availableDates.forEach(dateStr => {
      const date = new Date(dateStr)

      if (chartRange === 'month') {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        uniqueDates.add(monthKey)
      } else if (chartRange === 'year') {
        const yearKey = date.getFullYear().toString()
        uniqueDates.add(yearKey)
      }
    })

    return Array.from(uniqueDates)
  }

  const filteredDates = getFilteredDates()

  return (
    <div className="space-y-6">
      <Card className="!p-0">
        <CardHeader className="border-b-0 py-3">
          <CardTitle>
            <span className="text-sm font-normal text-gray-500">
              {t('timestamp')} {formatDateForDisplay(selectedDate, 'day')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <ChemicalIndicatorCard
              title={t('sugar')}
              value={currentSnapshot.sugarContent[0]?.value || 0}
              unit={t('measure')}
              date={currentSnapshot.sugarContent[0]?.date}
              icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
            />
            <ChemicalIndicatorCard title="pH" value={currentSnapshot.ph[0]?.value || 0} unit="pH" date={currentSnapshot.ph[0]?.date} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
            <ChemicalIndicatorCard
              title={t('alcohol')}
              value={currentSnapshot.alcohol[0]?.value || 0}
              unit="%"
              date={currentSnapshot.alcohol[0]?.date}
              icon={<Flame className="h-4 w-4 text-muted-foreground" />}
            />
            <ChemicalIndicatorCard
              title={t('volatile_acidity')}
              value={currentSnapshot.volatileAcidity[0]?.value || 0}
              unit={t('measure')}
              date={currentSnapshot.volatileAcidity[0]?.date}
              icon={<Wind className="h-6 w-6 text-muted-foreground" />}
            />
            <ChemicalIndicatorCard
              title={t('total_acidity')}
              value={currentSnapshot.totalAcidity[0]?.value || 0}
              unit={t('measure')}
              date={currentSnapshot.totalAcidity[0]?.date}
              icon={<Layers className="h-6 w-6 text-muted-foreground" />}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
            <AdditionIndicatorCard title={`${t('free')} SO₂`} value={currentSnapshot.freeSO2} unit={t('measure2')} />
            <AdditionIndicatorCard title={`${t('total')} SO₂`} value={currentSnapshot.totalSO2} unit={t('measure2')} />
            <AdditionIndicatorCard title={t('density')} value={currentSnapshot.density} unit={t('measure3')} />
            <AdditionIndicatorCard title={t('malolactic')} value={currentSnapshot.malolactic ? t('done') : t('not_done')} />
            <AdditionIndicatorCard title={t('fermentationTemp')} value={currentSnapshot.fermentationTemp} unit="°C" />
          </div>
        </CardContent>
        <CardHeader className="border-b-0 py-3">
          <CardTitle>{t('dynamics')}:</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-4">
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
        </CardHeader>
        <CardContent className="pt-6">
          {chartData && chartData.data && chartData.data.length > 0 ? (
            <CharacteristicsCharts data={chartData} range={chartRange} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('no_data')}</p>
              <p className="text-sm text-gray-400 mt-2"> {t('chose_other_period')} </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
