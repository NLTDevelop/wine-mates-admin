import { Button } from '@/UIKit/shadcn/ui/button'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { USER_CATEGORIES } from '../entities/IUser'


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
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor(row => `${row.lastName} ${row.firstName}`, {
        header: t('table.username'),
        cell: info => info.getValue(),
        meta: { cellClassName: 'text-start' },
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
        cell: ({ row }) => {
          const handleConfirmCategory = (e: React.MouseEvent) => {
            console.log('confirm category for userId:', row.original.id)
            e.stopPropagation()
            onConfirmCategory(row.original.id)
          }
          const isWineLower = row.original.category === USER_CATEGORIES.WINE_LOVER
          return !isWineLower ? (
            <Button variant="outline" size="sm" onClick={handleConfirmCategory} className="">
              {t('confirm')}
            </Button>
          ) : null
        },
      }),
    ],
    [columnHelper, onConfirmCategory]
  )
}
