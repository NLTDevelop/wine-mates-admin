import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { TabsContent } from '@/UIKit/shadcn/ui/tabs'
import { Fragment } from 'react'
import { useTableStatsColumns } from '../../presenters/useTableStatsColumns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/UIKit/shadcn/ui/table'
import { AggregatedCellData, StatsFilters } from '../../entities/types'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { useTranslation } from 'react-i18next'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { TableRowData, useTableStatsData } from '../../presenters/useTableStatsData'

interface TableStatsProps {
  ageGroups: string[]
  years: number[]
  aggregatedData: Record<string, AggregatedCellData | undefined>
  selectedGender?: 'male' | 'female' | 'all'
  selectedYear: string
  totalCount: number
  filters: StatsFilters
  onChangePagination: (page: number) => void
}

export const TableStats = ({ ageGroups, years, aggregatedData, selectedGender = 'all', selectedYear, totalCount, filters, onChangePagination }: TableStatsProps) => {
  const { t } = useTranslation('stats')

  const { data } = useTableStatsData({ years, ageGroups, aggregatedData, selectedGender })

  const columns = useTableStatsColumns({ ageGroups, aggregatedData, selectedGender })

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  if (data.length === 0) {
    return (
      <TabsContent value="detailed">
        <Card>
          <CardHeader className="border-b-0">
            <CardTitle className="text-foreground font-bold">{t('detailed_stats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">{t('no_data')}</p>
          </CardContent>
        </Card>
      </TabsContent>
    )
  }

  return (
    <Card className="!px-0">
      <CardHeader className="pt-0 border-b-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground font-bold">{t('detailed_stats')}</CardTitle>
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
      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? (
        <NLTTablePagination limit={filters.limit || DEFAULT_PAGINATION_LIMIT} page={filters.page || 1} totalRows={totalCount || 1} setPage={onChangePagination} />
      ) : null}
    </Card>
  )
}
