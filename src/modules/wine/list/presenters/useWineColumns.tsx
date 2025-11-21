import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Check, Edit, Trash2, X } from 'lucide-react'
import { IWines } from '../entities/types/types'
import { useMemo } from 'react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { useTranslation } from 'react-i18next'
import { getDisplayNames } from '@/lib/utils'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
}

const TruncatedTextCell = ({ text, maxLength = 50 }: { text?: string; maxLength?: number }) => {
  const displayText = text || '-'
  const shouldTruncate = displayText.length > maxLength
  const truncatedText = shouldTruncate ? `${displayText.substring(0, maxLength)}...` : displayText

  if (shouldTruncate) {
    return (
      <NLTTooltip
        delay={500}
        message={displayText}
        className="bg-blue-100 text-popover-foreground max-w-[400px] break-words"
        trigger={<div className="line-clamp-2 cursor-help text-start">{truncatedText}</div>}
      />
    )
  }

  return <div className="text-start">{displayText}</div>
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
            row.original.id && onDelete(row.original.id, row.original.displayName || 'невідоме вино')
          }

          const handleConfirmWine = (e: React.MouseEvent) => {
            stopEvent(e)
            onConfirm(row.original.id)
          }
          return (
            <div className="flex">
              <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
              <NLTTooltip
                delay={500}
                message={!row.original.isConfirmed ? t('button.cancel_confirm') : t('button.confirm')}
                className="bg-blue-100 text-popover-foreground max-w-[400px] break-words"
                trigger={
                  <Button variant="ghost" size="sm" onClick={handleConfirmWine} style={{ pointerEvents: 'auto' }}>
                    {!row.original.isConfirmed ? <Check className="text-green-600" /> : <X className="text-red-500" />}
                  </Button>
                }
              />
            </div>
          )
        },
        size: 100,
        meta: { cellClassName: 'text-center' },
      }),
      columnHelper.accessor('displayName', {
        header: t('table.winename'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producerTitle', {
        header: t('table.producertitle'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producerName', {
        header: t('table.producername'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('wine', {
        header: t('table.wine'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('grapeVariety', {
        header: t('table.grapevariety'),
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('country', {
        header: t('table.country'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('region', {
        header: t('table.region'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('subRegion', {
        header: t('table.subregion'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('site', {
        header: t('table.site'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('type', {
        header: t('table.type'),
        cell: info => {
          const type = info.getValue()
          const {nameUa, nameEn} = getDisplayNames(type?.translations || [])
          return /*type?.*/nameUa || /*type?.*/nameEn || '-'
        },
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('subType', {
        header: t('table.subtype'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('designation', {
        header: t('table.designation'),
        cell: info => info.getValue() || '-',
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('classification', {
        header: t('table.classification'),
        cell: info => info.getValue() || '-',
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('vintageConfig', {
        header: t('table.vintageconfig'),
        cell: info => info.getValue() || '-',
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('firstVintage', {
        header: t('table.firstvintage'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('finalVintage', {
        header: t('table.finalvintage'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('reference', {
        header: t('table.reference'),
        cell: info => info.getValue() || '-',
        size: 120,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('description', {
        header: t('table.description'),
        cell: info => <TruncatedTextCell text={info.getValue()} maxLength={40} />,
        size: 200,
      }),
      columnHelper.display({
        id: 'images',
        header: t('table.images'),
        cell: ({ row }) => <div>{row.original.images && row.original.images.length > 0 ? `${row.original.images.length} файл(ів)` : '-'}</div>,
        size: 120,
      }),
    ],
    [onEdit, onDelete, onConfirm, t]
  )
}
