import { useMemo } from 'react'
import { CharacteristicsHistoryResponse } from '../entities/types'
import { useTranslation } from 'react-i18next'

interface ChartConfig {
  key: 'sugarContent' | 'ph' | 'alcohol' | 'volatileAcidity' | 'totalAcidity'
  color: string
  name: string
  unit: string
}

interface UseCharacteristicsChartsProps {
  data: CharacteristicsHistoryResponse
  range: 'day' | 'month' | 'year'
}

export const useCharacteristicsCharts = ({ data, range }: UseCharacteristicsChartsProps) => {
  const { t } = useTranslation('analysis')

  const allChartConfigs: ChartConfig[] = [
    { key: 'sugarContent', color: '#8884d8', name: t('sugar_content'), unit: t('measure') },
    { key: 'ph', color: '#82ca9d', name: 'pH', unit: 'pH' },
    { key: 'alcohol', color: '#ffc658', name: t('alcohol'), unit: '%' },
    { key: 'volatileAcidity', color: '#ff8042', name: t('volatile_acidity'), unit: t('measure') },
    { key: 'totalAcidity', color: '#0088fe', name: t('total_acidity'), unit: t('measure') },
  ]

  const formatXAxis = (value: string) => {
    const date = new Date(value)

    switch (range) {
      case 'day':
        return date.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })
      case 'month':
        return date.toLocaleDateString('ru-RU', {
          month: 'short',
          day: '2-digit',
        })
      case 'year':
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
        })
      default:
        return value
    }
  }

  const calculateYAxisDomain = (values: number[], unit: string): [number, number] => {
    if (values.length === 0) return [0, 10]

    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    if (unit === 'pH') {
      return [Math.max(2.8, minValue * 0.95), Math.min(4.2, maxValue * 1.05)]
    }

    if (minValue === maxValue) {
      if (minValue === 0) return [0, 1]
      return [Math.max(0, minValue * 0.9), minValue * 1.1]
    }

    const rangeValue = maxValue - minValue
    const padding = rangeValue * 0.1

    let lowerBound = minValue - padding
    let upperBound = maxValue + padding

    const nonNegativeUnits = [t('measure'), '%']
    if (nonNegativeUnits.includes(unit) && lowerBound < 0) {
      lowerBound = 0
      if (upperBound - lowerBound < rangeValue * 1.2) {
        upperBound = lowerBound + rangeValue * 1.2
      }
    }

    return [lowerBound, upperBound]
  }

  const formatTooltipValue = (value: number, unit: string): string => {
    if (unit === 'pH') {
      return `${value.toFixed(2)} ${unit}`
    }
    if (Math.abs(value) < 1) {
      return `${value.toFixed(3)} ${unit}`
    } else if (Math.abs(value) < 10) {
      return `${value.toFixed(2)} ${unit}`
    }
    return `${value.toFixed(1)} ${unit}`
  }

  const formatYAxisTick = (value: number, unit: string): string => {
    if (unit === 'pH') {
      return value.toFixed(2)
    }
    if (Math.abs(value) < 1) {
      return value.toFixed(3)
    } else if (Math.abs(value) < 10) {
      return value.toFixed(2)
    }
    return value.toFixed(1)
  }

  const chartData = useMemo(() => {
    return allChartConfigs
      .map(config => {
        const values = data.data.map(d => d[config.key]).filter(v => v !== undefined) as number[]

        const domain = calculateYAxisDomain(values, config.unit)

        return {
          ...config,
          enabled: values.length > 0,
          domain,
          minValue: values.length > 0 ? Math.min(...values) : 0,
          maxValue: values.length > 0 ? Math.max(...values) : 0,
          values,
        }
      })
      .filter(chart => chart.enabled)
  }, [data.data])

  return {
    chartData,
    formatXAxis,
    formatTooltipValue,
    formatYAxisTick,
    hasData: chartData.length > 0,
  }
}
