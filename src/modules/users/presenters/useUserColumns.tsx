import { Button } from '@/UIKit/shadcn/ui/button'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface IRow {
  id: string
  username: string
  phoneNumber: string
  country: string
  category: string
  firstName: string
  lastName: string
}

interface UseUserColumnsProps {
  onConfirmCategory: (userId: string) => void
}

export const useUserColumns = ({ onConfirmCategory }: UseUserColumnsProps) => {
  const columnHelper = createColumnHelper<IRow>()
  const { t } = useTranslation('users')

  return useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'id',
        header: t('table.id'),
        cell: info => info.getValue(),
        meta: {cellClassName: 'text-start'},
      }),
      columnHelper.accessor(row => `${row.lastName} ${row.firstName}`, {
        header: t('table.username'),
        cell: info => info.getValue(),
        meta: {cellClassName: 'text-start'},
      }),
      columnHelper.accessor('phoneNumber', {
        header: t('table.phone'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('country', {
        header: t('table.country'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: t('table.category'),
        cell: info => {
          const category = info.getValue()
          const categoryLabels = {
            wine_lover: 'Wine Lover',
            wine_expert: 'Wine Expert',
            winemaker: 'Winemaker',
          }
          return categoryLabels[category as keyof typeof categoryLabels] || category
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('table.actions'),
        cell: ({ row }) => (
          <Button
            variant="outline"
            onClick={() => onConfirmCategory(row.original.id)}
            className=""
          >
            {t("confirm") }
          </Button>
        ),
      }),
    ],
    [columnHelper, onConfirmCategory]
  )
}
