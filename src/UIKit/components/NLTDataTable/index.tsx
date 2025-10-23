import React from 'react'
import { type Table as ReactTable, flexRender } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/UIKit/shadcn/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/UIKit/shadcn/ui/table'
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
}

export function NLTDataTable<T>({
  table,
  rowClassname,
  onRowClick,
}: IProps<T>) {
  const { t } = useTranslation('common')

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-x-auto border-input">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    className={cn(
                      (header.column.columnDef.meta as ColumnMeta)?.cellClassName,
                      '[&:not(:first-child)]:text-center bg-secondary text-border'
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={cn(rowClassname, 'border-input')}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      className={(cell.column.columnDef.meta as ColumnMeta)?.cellClassName}
                      key={cell.id}
                    >
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
