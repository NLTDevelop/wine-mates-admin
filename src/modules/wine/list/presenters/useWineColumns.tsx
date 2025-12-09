import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 /*Check, X*/ } from 'lucide-react'
import { IWines } from '../entities/types/types'
import { useMemo } from 'react'
// import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
}

export const useWineColumns = ({ onEdit, onDelete, onConfirm }: WineTableProps) => {
  const { t } = useTranslation('wines')
  return useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: t('table.actions'),
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

          // const handleConfirmWine = (e: React.MouseEvent) => {
          //   stopEvent(e)
          //   onConfirm(row.original.id)
          // }
          return (
            <div className="flex">
              <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0 flex-1">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive hover:text-destructive flex-1">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
              {/* <NLTTooltip
                delay={500}
                message={!row.original.isConfirmed ? t('button.cancel_confirm') : t('button.confirm')}
                className="bg-blue-100 text-popover-foreground max-w-[400px] break-words"
                trigger={
                  <Button variant="ghost" size="sm" onClick={handleConfirmWine} style={{ pointerEvents: 'auto' }}>
                    {!row.original.isConfirmed ? <Check className="text-green-600" /> : <X className="text-red-500" />}
                  </Button>
                }
              /> */}
            </div>
          )
        },
        size: 100,
        meta: { cellClassName: 'text-center' },
      }),
      columnHelper.accessor('name', {
        header: t('table.winename'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('color', {
        header: t('table.color'),
        cell: info => {
          const color = info.getValue()
          return color?.name || '-'
        },
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producer', {
        header: t('table.producertitle'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('grapeVariety', {
        header: t('table.grapevariety'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('type', {
        header: t('table.type'),
        cell: info => {
          const type = info.getValue()
          return type?.name || '-'
        },
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('vintage', {
        header: t('table.vintageconfig'),
        cell: info => info.getValue() || '-',
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.display({
        id: 'images',
        header: t('table.images'),
        cell: ({ row }) => <div>{row.original.image ? '+' : '-'}</div>,
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
    ],
    [onEdit, onDelete, onConfirm, t]
  ) as ColumnDef<IWines>[]
}
