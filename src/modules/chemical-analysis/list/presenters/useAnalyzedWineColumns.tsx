import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IWineForAnalysis } from '../entities/types'

const columnHelper = createColumnHelper<IWineForAnalysis>()

export const useAnalyzedWineColumns = () => {
  const { t } = useTranslation('analysis')
  return useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('table.winename'),
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('typeName', {
        header: t('table.type'),
        cell: info => info.getValue() || '-',
        size: 120,
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
      columnHelper.accessor('capacityName', {
        header: t('table.capacityname'),
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

      columnHelper.accessor('vintage', {
        header: t('table.vintage'),
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
    [t]
  ) as ColumnDef<IWineForAnalysis>[]
}
