import React from 'react'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { CharacteristicsHistoryResponse, IChemicalMeasure, IWineAnalysisDetail, TasteHistoryResponse } from '../../entities/types'
import { CharacteristicsCharts } from './chemical-detail/characteristics-charts'
import { useTranslation } from 'react-i18next'
import { TastingContentView } from './taste-detail/tasting-content-view'
import { ChemicalAnalysisView } from './chemical-detail/chemical-analysis-view'
import { SelectDate } from './chemical-detail/select-date'

export interface ISnapshot {
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

interface AnalyzedWineDetailContentProps {
  analyzedWine: IWineAnalysisDetail
  currentSnapshot: ISnapshot
  chartData?: CharacteristicsHistoryResponse
  selectedDate: string
  availableDates: string[]
  chartRange: 'day' | 'month' | 'year'
  onDateChange: (date: string) => void
  onChartRangeChange: (range: 'day' | 'month' | 'year') => void
  sensoryData?: TasteHistoryResponse
  // analysisDates: string[]
}

export const AnalyzedWineDetailContent: React.FC<AnalyzedWineDetailContentProps> = ({
  sensoryData,
  // analysisDates,
  currentSnapshot,
  chartData,
  selectedDate,
  availableDates,
  chartRange,
  onDateChange,
  onChartRangeChange,
}) => {
  const { t } = useTranslation('analysis')

 
  return (
    <div className="space-y-6">
      <Card className="!p-0">
        <CardContent className="space-y-6">
          <TastingContentView analysisDates={availableDates} sensoryData={sensoryData} selectedDate={selectedDate} onDateChange={onDateChange} />
          <ChemicalAnalysisView currentSnapshot={currentSnapshot} />
          <SelectDate chartRange={chartRange} availableDates={availableDates} onChartRangeChange={onChartRangeChange} onDateChange={onDateChange} selectedDate={selectedDate} />
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
