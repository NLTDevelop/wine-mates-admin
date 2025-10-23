import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/UIKit/shadcn/ui/switch'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Feature } from '../enteties/types'

type IRow = Feature

interface UseFeatureColumnsProps {
  onToggle: (key: Feature['key'], is_enabled: boolean) => Promise<void>
  isUpdating: boolean
}

export const useFeatureColumns = ({ onToggle, isUpdating }: UseFeatureColumnsProps) => {
  const columnHelper = createColumnHelper<IRow>()
  const { t } = useTranslation('features')

  return useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: t('table.feature_name'),
        cell: info => info.getValue(),
        meta: { cellClassName: 'text-start w-1/3' },
      }),

      columnHelper.accessor('is_enabled', {
        id: 'status',
        header: t('table.status'),
        cell: info => {
          const isEnabled = info.getValue()
          return (
            <div className="text-center">
              <Badge className={`font-semibold ${isEnabled ? 'bg-green-600 hover:bg-green-600' : 'bg-gray-200 hover:bg-green-600 text-foreground'}`}>{t(isEnabled ? 'enabled' : 'disabled')}</Badge>
            </div>
          )
        },
        meta: { cellClassName: 'text-center w-1/6' },
      }),

      columnHelper.display({
        id: 'toggle_action',
        header: t('table.action'),
        cell: ({ row }) => {
          const feature = row.original

          const handleToggleChange = (checked: boolean) => {
            console.log('Checked switch->', checked)
            onToggle(feature.key, checked)
          }

          return (
            <div className="flex items-center justify-center space-x-2 " style={{ pointerEvents: 'auto' }}>
              <Switch
                checked={feature.is_enabled}
                onCheckedChange={handleToggleChange}
                disabled={isUpdating}
                className={isUpdating ? 'opacity-60 cursor-not-allowed' : ' cursor-pointer'}
              />
            </div>
          )
        },
        meta: { cellClassName: 'text-right w-1/6' },
      }),
    ],
    [columnHelper, t, onToggle, isUpdating]
  )
}
