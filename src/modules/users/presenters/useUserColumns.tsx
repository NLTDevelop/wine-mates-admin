import { Button } from '@/UIKit/shadcn/ui/button'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { USER_CATEGORIES } from '../entities/IUser'
import { getCountryName } from '@/lib/localized-countries'

interface IRow {
  id: string
  username: string
  phoneNumber: string
  email: string
  country: string
  wineExperienceLevel: string
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
      columnHelper.accessor(row => `${row.lastName || ''} ${row.firstName || ''}`.trim(), {
        header: t('table.username'),
        cell: info => {
          const fullName = info.getValue()
          const displayName = fullName || t('table.anonymous')

          return <span className={!fullName ? 'text-gray-400' : ''}>{displayName}</span>
        },
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('phoneNumber', {
        header: t('table.phone'),
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('country', {
        header: t('table.country'),
        cell: ({ getValue }) => {
          const countryCode = getValue()
          const countryName = getCountryName(countryCode, 'uk')
          return <div className="text-center">{countryName}</div>
        },
        meta: { cellClassName: 'text-center' },
      }),
      columnHelper.accessor('email', {
        header: t('table.email'),
        cell: info => info.getValue(),
         meta: { cellClassName: 'text-start w-fit break-all' },
      }),
      columnHelper.accessor('wineExperienceLevel', {
        header: t('table.category'),
        cell: info => {
          const category = info.getValue()
          const categoryLabels = {
            lover: t('lover'),
            expert: t('expert'),
            creator: t('creator'),
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
          const isWineLower = row.original.wineExperienceLevel === USER_CATEGORIES.WINE_LOVER
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
