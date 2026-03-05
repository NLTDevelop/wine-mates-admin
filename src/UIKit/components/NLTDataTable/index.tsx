import React from 'react'
import { type Table as ReactTable, flexRender } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/UIKit/shadcn/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/UIKit/shadcn/ui/table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface ColumnMeta {
  cellClassName?: string
}
interface IProps<T> {
  table: ReactTable<T>
  rowClassname?: string
  ToolBar?: React.ReactNode
  showColumnsSelector?: boolean
  onRowClick?: (row: any) => void
  hasActiveFilters?: boolean
  clearColumnFilters?: () => void
}

export function NLTDataTable<T>({ hasActiveFilters, clearColumnFilters, table, rowClassname, ToolBar, showColumnsSelector = false, onRowClick }: IProps<T>) {
  const { t } = useTranslation('common')
  const { t: w } = useTranslation('wines')

  return (
    <div className="w-full">
      {(showColumnsSelector || ToolBar) && (
        <div className="flex items-center py-4">
          {ToolBar}
          {showColumnsSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {t('columns')} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <div className="text-end mb-3">
        <Button variant="secondary" size="sm" onClick={clearColumnFilters} disabled={!hasActiveFilters} className={cn('transition-opacity', !hasActiveFilters && 'opacity-50 cursor-not-allowed')}>
          {w('clear_all_filters')}
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto border-input">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead className={cn((header.column.columnDef.meta as ColumnMeta)?.cellClassName, '[&:not(:first-child)]:text-start bg-secondary text-border')} key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(rowClassname, 'border-input', onRowClick ? 'cursor-pointer hover:bg-muted/50' : 'cursor-default')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell className={(cell.column.columnDef.meta as ColumnMeta)?.cellClassName} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {t('no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
