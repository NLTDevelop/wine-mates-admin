interface UseSelectDateForChartProps {
  availableDates: string[]
  chartRange: 'day' | 'month' | 'year'
}

export const useSelectDateForChart = ({ chartRange, availableDates }: UseSelectDateForChartProps) => {
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

  return {
    filteredDates,
    formatDateForDisplay,
  }
}
