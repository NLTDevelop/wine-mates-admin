import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 /*Check, X*/ } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IWines } from '@/modules/wine/list/entities/types/types'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
}

export const useEventsColumns = ({ onEdit, onDelete, onConfirm }: WineTableProps) => {
  const { t } = useTranslation('events')
  return useMemo(
    () => [
      // columnHelper.display({
      //   id: 'actions',
      //   header: () => <div className="text-center w-[70px] whitespace-nowrap">{t('table.action')}</div>,
      //   cell: ({ row }) => (
      //     <div className="flex gap-1 justify-center w-[70px]">
      //       <Button variant="ghost" size="sm">
      //         <Edit className="h-4 w-4 text-muted-foreground" />
      //       </Button>
      //       <Button variant="ghost" size="sm" className="text-destructive">
      //         <Trash2 className="h-4 w-4 text-red-700" />
      //       </Button>
      //     </div>
      //   ),
      //   size: 70,
      //   minSize: 70,
      //   maxSize: 100,
      // }),

      columnHelper.accessor('name', {
        header: t('table.place_name'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('name', {
        header: t('table.event_name'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('color', {
        header: t('table.time_work'),
        cell: info => {
          const color = info.getValue()
          return color?.name || '-'
        },
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('name', {
        header: t('table.data_event'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('name', {
        header: t('table.cost'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producer', {
        header: t('table.address'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      //
    ],
    [onEdit, onDelete, onConfirm, t]
  ) as ColumnDef<IWines>[]
}
