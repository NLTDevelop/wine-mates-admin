import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WineOfWinery } from '../entities/types'
import { useWineListOfWinery } from './useWineListOfWinery'
import { Checkbox } from '@radix-ui/react-checkbox'

const columnHelper = createColumnHelper<WineOfWinery>()

interface WineTableProps {
  onDelete?: (wineId: string, name: string) => void
  showCheckbox?:boolean
  showDelete?:boolean
}

const COLUMN_WIDTHS = {
  ACTIONS: 100,
  NAME: 200,
  PRODUCER: 180,
  GRAPE: 180,
  VINTAGE: 100,
  IMAGES: 120,
} as const

export const useWineListColumns = ({ onDelete, showCheckbox,showDelete }: WineTableProps) => {
  const { t } = useTranslation('wines')

  const {  filters } = useWineListOfWinery()

  return useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: () => <p className="text-center">{t('table.actions')}</p>,
        cell: ({ row }) => {
  
          const handleDeleteWine = (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            row.original.id && onDelete?.(row.original.id, row.original.name || t('not_known_wine'))
          }

          return (
            <div className="flex items-center justify-around">
              {showCheckbox && (
                <div className="pt-1 pr-3" >
                  <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="h-5 w-5" />
                </div>
              )}
              {showDelete && <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>}
            </div>
          )
        },
        minSize: COLUMN_WIDTHS.ACTIONS,
        maxSize: COLUMN_WIDTHS.ACTIONS,
        size: COLUMN_WIDTHS.ACTIONS,
        meta: { cellClassName: 'text-center' },
      }),

      columnHelper.accessor('name', {
        header: () => t('table.winename'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.NAME,
        maxSize: COLUMN_WIDTHS.NAME,
        size: COLUMN_WIDTHS.NAME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px] break-words` },
      }),

     
      columnHelper.accessor('producer', {
        header: () => t('table.producertitle'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.PRODUCER,
        maxSize: COLUMN_WIDTHS.PRODUCER,
        size: COLUMN_WIDTHS.PRODUCER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRODUCER}px] break-words` },
      }),

      columnHelper.accessor('grapeVariety', {
        header: () => t('table.grapevariety'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.GRAPE,
        maxSize: COLUMN_WIDTHS.GRAPE,
        size: COLUMN_WIDTHS.GRAPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.GRAPE}px] break-words` },
      }),


      columnHelper.accessor('vintage', {
        header: () => t('table.vintageconfig'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.VINTAGE,
        maxSize: COLUMN_WIDTHS.VINTAGE,
        size: COLUMN_WIDTHS.VINTAGE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.VINTAGE}px]` },
      }),

     
      columnHelper.display({
        id: 'images',
        header: () => <span>{t('table.images')}</span>,
        cell: ({ row }) => {
          const wine = row.original

          if (wine.image) {
            return <img src={wine.image.smallUrl} alt={wine.image.name} className="w-8 h-12 object-cover" />
          }

          
          return <div className="w-8 h-12 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">-</div>
        },
        minSize: COLUMN_WIDTHS.IMAGES,
        maxSize: COLUMN_WIDTHS.IMAGES,
        size: COLUMN_WIDTHS.IMAGES,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.IMAGES}px]` },
      }),
    ],
    [
      onDelete,
      t,
      filters,
    ]
  ) as ColumnDef<WineOfWinery>[]
}
