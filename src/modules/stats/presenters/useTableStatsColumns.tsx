import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Mars, Star, Venus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AggregatedCellData {
  ratingsCount: number
  averageRating: number
}

export interface TableRow {
  year: number
  gender: 'male' | 'female'
  showYear?: boolean
}

interface UseTableStatsColumnsProps {
  ageGroups: string[]
  aggregatedData: Record<string, AggregatedCellData | undefined>
  selectedGender?: 'male' | 'female' | 'all'
}

export const useTableStatsColumns = ({ ageGroups, aggregatedData, selectedGender = 'all' }: UseTableStatsColumnsProps) => {
  const { t } = useTranslation('stats')

  return useMemo<ColumnDef<TableRow>[]>(() => {
    const base: ColumnDef<TableRow>[] = [
      {
        accessorKey: 'year',
        header: t('year'),
        cell: ({ getValue, row }) => {
          const year = getValue<number>()
          const rowData = row.original as TableRow

          if (!rowData.showYear) {
            return null
          }

          return <div className="font-medium text-center">{year}</div>
        },
      },
      {
        id: 'gender',
        header: t('sex'),
        cell: ({ row }) =>
          row.original.gender === 'male' ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-full">
              <div className="flex items-center gap-1">
                <Mars className="w-5 h-5" />
                <span>{t('male')}</span>
              </div>
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200  w-full">
              <div className="flex items-center gap-1">
                <Venus className="w-5 h-5" />
                <span>{t('female')}</span>
              </div>
            </Badge>
          ),
      },
    ]

    const ageColumns: ColumnDef<TableRow>[] = ageGroups.map(age => ({
      id: age,
      header: () => (
        <div className="text-center font-medium">
          {age} {t('years')}
        </div>
      ),
      columns: [
        {
          id: `${age}-count`,
          header: () => <div className="text-xs text-muted-foreground text-center">{t('qty')}</div>,
          cell: ({ row }) => {
            const key = `${row.original.year}-${row.original.gender}-${age}`
            const d = aggregatedData[key]
            return <div className="text-center">{d ? d.ratingsCount : '-'}</div>
          },
        },
        {
          id: `${age}-rating`,
          header: () => <div className="text-xs text-muted-foreground text-center">{t('rating')}</div>,
          cell: ({ row }) => {
            const key = `${row.original.year}-${row.original.gender}-${age}`
            const d = aggregatedData[key]

            return d ? (
              <div className="flex items-center justify-center">
                <span className="font-medium">{d.averageRating.toFixed(1)}</span>
                <Star className="ml-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
              </div>
            ) : (
              <div className="text-center">-</div>
            )
          },
        },
      ],
    }))

    return [...base, ...ageColumns]
  }, [ageGroups, aggregatedData, selectedGender])
}
