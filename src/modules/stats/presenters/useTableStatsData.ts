import { useMemo } from 'react'
import { AggregatedCellData } from '../entities/types'

export interface TableRowData {
  year: number
  gender: 'male' | 'female'
  rowSpan?: number
  showYear?: boolean
}

interface UseTableStatsDataProps {
  years: number[]
  ageGroups: string[]
  aggregatedData: Record<string, AggregatedCellData | undefined>
  selectedGender: 'male' | 'female' | 'all'
}

const hasDataForRow = (year: number, gender: 'male' | 'female', ageGroups: string[], aggregatedData: Record<string, AggregatedCellData | undefined>): boolean => {
  return ageGroups.some(age => {
    const key = `${year}-${gender}-${age}`
    const data = aggregatedData[key]
    return data && data.ratingsCount > 0
  })
}

export const useTableStatsData = ({ years, ageGroups, aggregatedData, selectedGender }: UseTableStatsDataProps) => {
  const data = useMemo<TableRowData[]>(() => {
    const rows: TableRowData[] = []

    years.forEach(year => {
      const gendersToShow: ('male' | 'female')[] = selectedGender === 'all' ? ['male', 'female'] : [selectedGender]

      const yearRows: TableRowData[] = []

      gendersToShow.forEach(gender => {
        if (hasDataForRow(year, gender, ageGroups, aggregatedData)) {
          yearRows.push({
            year,
            gender,
          })
        }
      })

      if (selectedGender === 'all' && yearRows.length > 0) {
        yearRows.forEach((row, index) => {
          if (index === 0) {
            rows.push({ ...row, rowSpan: yearRows.length, showYear: true })
          } else {
            rows.push({ ...row, showYear: false })
          }
        })
      } else {
        rows.push(...yearRows.map(row => ({ ...row, showYear: true })))
      }
    })

    return rows
  }, [years, ageGroups, aggregatedData, selectedGender])

  return { data }
}
