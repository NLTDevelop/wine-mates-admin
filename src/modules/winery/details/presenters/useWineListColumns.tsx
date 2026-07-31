/* eslint-disable react/react-in-jsx-scope */
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, ExternalLink, Trash2 } from 'lucide-react'
import { MouseEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { WineOfWinery } from '../../wine-list/entities/types'
import { getWineryWineOffer } from '../../wine-list/entities/wine-offer-helpers'
import { Checkbox } from '@radix-ui/react-checkbox'

const columnHelper = createColumnHelper<WineOfWinery>()

interface WineTableProps {
  onDelete?: (wineId: string, name: string, wine: WineOfWinery) => void
  onEdit?: (wine: WineOfWinery) => void
  showCheckbox?: boolean
  showDelete?: boolean
  showEdit?: boolean
  showOfferColumns?: boolean
}

const COLUMN_WIDTHS = {
  ACTIONS: 100,
  NAME: 220,
  PRODUCER: 180,
  GRAPE: 180,
  VINTAGE: 100,
  IMAGES: 120,
  PRICE: 140,
  QUANTITY: 120,
  WEBSITE: 220,
} as const

const normalizePrice = (price?: string | number | null) => {
  if (price === null || price === undefined || price === '') return '-'
  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice)) return String(price)
  return numericPrice.toFixed(2)
}

const getWineImageUrl = (wine: WineOfWinery) => wine.image?.smallUrl || wine.image?.mediumUrl || wine.image?.originalUrl || wine.image?.originUrl || ''

export const useWineListColumns = ({ onDelete, onEdit, showCheckbox, showDelete, showEdit, showOfferColumns }: WineTableProps) => {
  const { t } = useTranslation('wines')

  return useMemo(() => {
    const columns: ColumnDef<WineOfWinery>[] = [
      columnHelper.display({
        id: 'actions',
        header: () => <p className="text-center">{t('table.actions')}</p>,
        cell: ({ row }) => {
          const wineName = row.original.name || row.original.producer || t('not_known_wine')

          const handleEditWine = (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            onEdit?.(row.original)
          }

          const handleDeleteWine = (e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            if (row.original.id) {
              onDelete?.(String(row.original.id), wineName, row.original)
            }
          }

          return (
            <div className="flex items-center justify-around gap-1">
              {showCheckbox && (
                <div className="pt-1 pr-3">
                  <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="h-5 w-5" />
                </div>
              )}
              {showEdit && (
                <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4 text-green-600" />
                </Button>
              )}
              {showDelete && (
                <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4 text-red-700" />
                </Button>
              )}
            </div>
          )
        },
        minSize: COLUMN_WIDTHS.ACTIONS,
        maxSize: COLUMN_WIDTHS.ACTIONS,
        size: COLUMN_WIDTHS.ACTIONS,
        meta: { cellClassName: 'text-center' },
      }),

      columnHelper.display({
        id: 'name',
        header: () => t('table.winename'),
        cell: ({ row }) => row.original.name || row.original.producer || '-',
        minSize: COLUMN_WIDTHS.NAME,
        maxSize: COLUMN_WIDTHS.NAME,
        size: COLUMN_WIDTHS.NAME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px] break-words` },
      }),

      columnHelper.display({
        id: 'producer',
        header: () => t('table.producertitle'),
        cell: ({ row }) => row.original.producer || '-',
        minSize: COLUMN_WIDTHS.PRODUCER,
        maxSize: COLUMN_WIDTHS.PRODUCER,
        size: COLUMN_WIDTHS.PRODUCER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRODUCER}px] break-words` },
      }),

      columnHelper.display({
        id: 'grapeVariety',
        header: () => t('table.grapevariety'),
        cell: ({ row }) => row.original.grapeVariety || '-',
        minSize: COLUMN_WIDTHS.GRAPE,
        maxSize: COLUMN_WIDTHS.GRAPE,
        size: COLUMN_WIDTHS.GRAPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.GRAPE}px] break-words` },
      }),

      columnHelper.display({
        id: 'vintage',
        header: () => t('table.vintageconfig'),
        cell: ({ row }) => row.original.vintage || '-',
        minSize: COLUMN_WIDTHS.VINTAGE,
        maxSize: COLUMN_WIDTHS.VINTAGE,
        size: COLUMN_WIDTHS.VINTAGE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.VINTAGE}px]` },
      }),

      columnHelper.display({
        id: 'images',
        header: () => <span>{t('table.images')}</span>,
        cell: ({ row }) => {
          const imageUrl = getWineImageUrl(row.original)

          if (imageUrl) {
            return <img src={imageUrl} alt={row.original.name || row.original.producer || 'Wine image'} className="h-12 w-8 rounded-sm object-cover" />
          }

          return <div className="flex h-12 w-8 items-center justify-center bg-gray-100 text-xs text-gray-400">-</div>
        },
        minSize: COLUMN_WIDTHS.IMAGES,
        maxSize: COLUMN_WIDTHS.IMAGES,
        size: COLUMN_WIDTHS.IMAGES,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.IMAGES}px]` },
      }),
    ]

    if (showOfferColumns) {
      columns.push(
        columnHelper.display({
          id: 'price',
          header: () => t('table.price'),
          cell: ({ row }) => {
            const offer = getWineryWineOffer(row.original)
            const price = normalizePrice(offer?.price)
            return price === '-' ? '-' : `${price} ${offer?.currency || 'UAH'}`
          },
          minSize: COLUMN_WIDTHS.PRICE,
          maxSize: COLUMN_WIDTHS.PRICE,
          size: COLUMN_WIDTHS.PRICE,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRICE}px]` },
        }),
        columnHelper.display({
          id: 'quantity',
          header: () => t('table.quantity'),
          cell: ({ row }) => getWineryWineOffer(row.original)?.quantity ?? '-',
          minSize: COLUMN_WIDTHS.QUANTITY,
          maxSize: COLUMN_WIDTHS.QUANTITY,
          size: COLUMN_WIDTHS.QUANTITY,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.QUANTITY}px]` },
        }),
        columnHelper.display({
          id: 'websiteUrl',
          header: () => t('table.website'),
          cell: ({ row }) => {
            const websiteUrl = getWineryWineOffer(row.original)?.websiteUrl

            return websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                <span className="truncate">{websiteUrl}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
            ) : (
              '-'
            )
          },
          minSize: COLUMN_WIDTHS.WEBSITE,
          maxSize: COLUMN_WIDTHS.WEBSITE,
          size: COLUMN_WIDTHS.WEBSITE,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.WEBSITE}px]` },
        })
      )
    }

    return columns
  }, [onDelete, onEdit, showCheckbox, showDelete, showEdit, showOfferColumns, t]) as ColumnDef<WineOfWinery>[]
}
