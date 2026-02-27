import { ColumnDef, createColumnHelper, Table } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { IWines } from '../entities/types/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/UIKit/shadcn/ui/checkbox'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
  onUnion: () => void
}

const getIsMoreThanOneRowSelected = (table: Table<IWines>) => {
  return (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && table.getSelectedRowModel().rows.length > 1
}

export const useWineColumns = ({ onEdit, onDelete, onConfirm, onUnion }: WineTableProps) => {
  const { t } = useTranslation('wines')
  return useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return isAnyRowSelected ? (
            <div className="relative h-8">
              <Button className="absolute top-1 left-2 h-6 z-10" onClick={onUnion}>
                {t('list.union_btn')}
              </Button>
            </div>
          ) : (
            t('table.actions')
          )
        },
        cell: ({ row }) => {
          const stopEvent = (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
          }

          const handleEditWine = (e: React.MouseEvent) => {
            stopEvent(e)
            onEdit(row.original)
          }

          const handleDeleteWine = (e: React.MouseEvent) => {
            stopEvent(e)
            row.original.id && onDelete(row.original.id, row.original.name || t('not_known_wine'))
          }

          return (
            <div className="flex items-center">
              <div className="pt-1 pr-3" onClick={e => stopEvent(e)}>
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={value => {
                    row.toggleSelected(!!value)
                  }}
                  aria-label="Select row"
                  disabled={false}
                  className="h-5 w-5"
                />
              </div>

              <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0 flex-1">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive hover:text-destructive flex-1">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </div>
          )
        },
        size: 100,
        meta: { cellClassName: 'text-center' },
      }),
      columnHelper.accessor('name', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.winename')}</span>
        },
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('color', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.color')}</span>
        },
        cell: info => {
          const color = info.getValue()
          return color?.name || '-'
        },
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producer', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.producertitle')}</span>
        },
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('grapeVariety', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.grapevariety')}</span>
        },
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('type', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.type')}</span>
        },
        cell: info => {
          const type = info.getValue()
          return type?.name || '-'
        },
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('vintage', {
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.vintageconfig')}</span>
        },
        cell: info => info.getValue() || '-',
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.display({
        id: 'images',
        header: ({ table }) => {
          const isAnyRowSelected = getIsMoreThanOneRowSelected(table)
          return <span className={isAnyRowSelected ? 'opacity-0' : ''}> {t('table.images')}</span>
        },
        cell: ({ row }) => {
          return <div>{row.original.image ? '+' : '-'}</div>
        },
        size: 120,
        meta: { cellClassName: 'text-center' },
      }),
    ],
    [onEdit, onDelete, onConfirm, t]
  ) as ColumnDef<IWines>[]
}
