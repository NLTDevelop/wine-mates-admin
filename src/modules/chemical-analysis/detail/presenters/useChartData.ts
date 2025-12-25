import { useMemo } from 'react'
import { parseISO, format, isSameDay } from 'date-fns'
import { IChemicalMeasure } from '../entities/types'

interface ChartPoint {
  date: string
  value: number
  displayDate: string
  isSelected: boolean
}

export const useChartData = (measurements: IChemicalMeasure[] = [], selectedDate?: string): ChartPoint[] => {
  return useMemo(() => {
    if (!measurements.length) return []

    const sorted = [...measurements].sort((a, b) => +new Date(a.date) - +new Date(b.date))

    return sorted.map((m, index) => {
      const isSelected = !selectedDate || selectedDate === 'current' ? index === sorted.length - 1 : isSameDay(parseISO(m.date), parseISO(selectedDate))

      return {
        date: m.date,
        value: m.value,
        displayDate: format(parseISO(m.date), 'dd MMM'),
        isSelected,
      }
    })
  }, [measurements, selectedDate])
}
