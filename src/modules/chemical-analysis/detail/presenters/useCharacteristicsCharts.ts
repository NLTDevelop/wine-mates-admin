export const useCharacteristicsCharts = () => {
  const formatXAxis = (value: string, periodType: 'day' | 'month' | 'year') => {
    const date = new Date(value)

    switch (periodType) {
      case 'day':
        return date.toLocaleTimeString('uk-UA', {
          hour: '2-digit',
          minute: '2-digit',
        })
      case 'month':
        return date.toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: 'short',
        })
      case 'year':
        return date.toLocaleDateString('uk-UA', {
          month: 'short',
          year: 'numeric',
        })
      default:
        return value
    }
  }

  const formatTooltipValue = (value: number, unit: string): string => {
    if (unit === 'pH' || unit === 'рН') {
      return value.toFixed(2)
    }
    return value.toFixed(2)
  }

  const formatYAxisTick = (value: number, unit: string): string => {
    return value.toFixed(unit === 'pH' || unit === 'рН' ? 2 : 1)
  }

  return {
    formatXAxis,
    formatTooltipValue,
    formatYAxisTick,
  }
}
