import { ColumnDef } from '@tanstack/react-table'
import { Proposition, PropositionsType } from '../entities/types/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const useUserPropositionsColumns = (activeTab: PropositionsType) => {
  const { t } = useTranslation('propositions')

  return useMemo(() => {
    const baseColumns: ColumnDef<Proposition>[] = [
      {
        id: 'index',
        header: '№',
        cell: info => {
          const rowIndex = info.row.index
          const pageIndex = info.table.getState().pagination.pageIndex
          const pageSize = info.table.getState().pagination.pageSize
          return pageIndex * pageSize + rowIndex + 1
        },
        size: 60,
        meta: {
          cellClassName: 'text-center font-medium',
          headerClassName: 'text-center',
        },
      },
      {
        id: 'name',
        header: activeTab === 'taste' ? t('table.taste') : t('table.aroma'),
        accessorKey: 'name',
        cell: info => info.getValue(),
        size: 200,
        meta: { cellClassName: 'text-start' },
      },
      {
        id: 'createdAt',
        header: t('table.createdAt'),
        accessorKey: 'createdAt',
        cell: info => {
          const date = info.getValue<string>()
          return new Date(date).toLocaleDateString('ru-RU')
        },
        size: 150,
        meta: { cellClassName: 'text-start' },
      },
    ]

    return baseColumns
  }, [t, activeTab])
}
