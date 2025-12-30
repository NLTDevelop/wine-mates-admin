import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Wine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { VisualAnalysis } from './visual-analysis'
import { TasteHistoryResponse } from '../../../entities/types'
import { TasteAnalysis } from './taste-analysis'
import { AromaAnalysis } from './aroma-analysis'

interface TastingContentProps {
  sensoryData?: TasteHistoryResponse
  selectedDate: string
  analysisDates: string[]
  onDateChange?: (date: string) => void
  isLoading?: boolean
}

export const TastingContentView: React.FC<TastingContentProps> = ({ sensoryData, selectedDate, analysisDates = [], onDateChange, isLoading = false }) => {
  const { t } = useTranslation('analysis')
  const [_formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    if (selectedDate) {
      try {
        const date = new Date(selectedDate)
        setFormattedDate(format(date, 'dd MMMM yyyy', { locale: ru }))
      } catch {
        setFormattedDate(selectedDate)
      }
    }
  }, [selectedDate])

  // const handleDateChange = (date: string) => {
  //   if (onDateChange) {
  //     onDateChange(date)
  //   }
  // }

  if (isLoading) {
    return <p>TODO skeleton</p>
  }

  if (!sensoryData) {
    return <p>{t('no_data')}</p>
  }

  const { visual, aroma, taste } = sensoryData

  return (
    <div className="space-y-3 ">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <Wine className="h-5 w-5" />
        {t('visual_aroma_analysis')}
      </h3>
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-gray-500">{t('date')}:</span>

        <Select value={selectedDate} onValueChange={onDateChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {analysisDates.map(date => {
              const dateNew = new Date(date)
              return (
                <SelectItem key={date} value={date}>
                  {dateNew.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VisualAnalysis visual={visual} />
        <AromaAnalysis aroma={aroma} />
        <TasteAnalysis taste={taste} />
      </div>
    </div>
  )
}
