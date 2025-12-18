import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { TabsContent } from '@/UIKit/shadcn/ui/tabs'
import { Fragment, useMemo } from 'react'
import { useTableStatsColumns } from '../../presenters/useTableStatsColumns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/UIKit/shadcn/ui/table'
import { AggregatedCellData } from '../../entities/types'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { useTranslation } from 'react-i18next'

interface TableStatsProps {
  ageGroups: string[]
  years: number[]
  aggregatedData: Record<string, AggregatedCellData | undefined>
  selectedGender?: 'male' | 'female' | 'all'
  selectedYear: string
}

interface TableRowData {
  year: number
  gender: 'male' | 'female'
  rowSpan?: number
  showYear?: boolean
}

const hasDataForRow = (year: number, gender: 'male' | 'female', ageGroups: string[], aggregatedData: Record<string, AggregatedCellData | undefined>): boolean => {
  return ageGroups.some(age => {
    const key = `${year}-${gender}-${age}`
    const data = aggregatedData[key]
    return data && data.ratingsCount > 0
  })
}

export const TableStats = ({ ageGroups, years, aggregatedData, selectedGender = 'all', selectedYear }: TableStatsProps) => {
  const { t } = useTranslation('stats')

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

  const columns = useTableStatsColumns({
    ageGroups,
    aggregatedData,
    selectedGender,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (data.length === 0) {
    return (
      <TabsContent value="detailed">
        <Card>
          <CardHeader className="border-b-0">
            <CardTitle className='text-foreground font-bold'>{t('detailed_stats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">{t('no_data')}</p>
          </CardContent>
        </Card>
      </TabsContent>
    )
  }

  return (
    <Card>
      <CardHeader className="pt-0 border-b-0">
        <div className="flex justify-between items-center">
          <CardTitle className='text-foreground font-bold'>{t('detailed_stats')}</CardTitle>
          <Badge className="text-sm text-input bg-accent-foreground/80">{selectedYear === 'all' ? t('data_of_years', { count: years.length }) : t('data_of_years', { slug: selectedYear })}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border border-input rounded-md">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow className="border-y-input">
                <TableHead rowSpan={2} className="text-center align-middle  text-input ">
                  {t('year')}
                </TableHead>
                <TableHead rowSpan={2} className=" align-middle  text-input">
                  {t('sex')}
                </TableHead>
                {ageGroups.map(age => (
                  <TableHead key={age} colSpan={2} className="text-center  text-input ">
                    {age} {t('years')}
                  </TableHead>
                ))}
              </TableRow>

              <TableRow>
                {ageGroups.map(age => (
                  <Fragment key={`sub-${age}`}>
                    <TableHead className="text-center text-xs   text-input">{t('qty')}</TableHead>
                    <TableHead className="text-center text-xs  text-input ">{t('rating')}</TableHead>
                  </Fragment>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map(row => {
                const rowData = row.original as TableRowData

                return (
                  <TableRow key={row.id} className="border-y-secondary/30 pointer-events-none">
                    {row.getVisibleCells().map(cell => {
                      if (cell.column.id === 'year' && !rowData.showYear) {
                        return null
                      }

                      return (
                        <TableCell key={cell.id} className="align-top " rowSpan={cell.column.id === 'year' && rowData.rowSpan ? rowData.rowSpan : 1}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
