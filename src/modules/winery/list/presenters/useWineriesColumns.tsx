import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterableHeader } from '../../../../UIKit/app-components/table-headers/filterable-header'
import { IWinery } from '../entities/types'
import { useWineriesList } from './useWinariesList'
import { useWineryFilters } from './useWineryFilters'
import { useRegionOptions } from '@/modules/wine/create-wine/presenters/useRegionOptions'

const columnHelper = createColumnHelper<IWinery>()

interface WineriesTableProps {
  onEdit?: (winery: IWinery) => void
  onConfirm?: (wineryId?: string) => void
}

const COLUMN_WIDTHS = {
  ACTIONS: 100,
  NAME: 200,
  DESCRIPTION: 300,
  FOUNDED_YEAR: 200,
  COUNTRY: 140,
  REGION: 140,
} as const

export const useWineriesColumns = ({ onEdit, onConfirm }: WineriesTableProps) => {
  const { t } = useTranslation('winery')

  const { handleColumnFilter, filters } = useWineriesList()

  const { getCountryFilterOptions } = useWineryFilters()

  const { regions, isLoading: regionsLoading } = useRegionOptions({ countryId: filters?.countryId })

  const regionFilterOptions = useMemo(
    () =>
      regions.map(region => ({
        label: region.name,
        value: region.id,
      })),
    [regions]
  )

  return useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: () => <p className="text-center">{t('table.actions')}</p>,
        cell: ({ row }) => {
          const handleEditWinery = (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            onEdit?.(row.original)
          }

          return (
            <Button variant="ghost" size="sm" onClick={handleEditWinery} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
          )
        },
        minSize: COLUMN_WIDTHS.ACTIONS,
        maxSize: COLUMN_WIDTHS.ACTIONS,
        size: COLUMN_WIDTHS.ACTIONS,
        meta: { cellClassName: 'text-center' },
      }),

      columnHelper.accessor('name', {
        header: () =>t('table.name'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.NAME,
        maxSize: COLUMN_WIDTHS.NAME,
        size: COLUMN_WIDTHS.NAME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px] break-words` },
      }),

      columnHelper.accessor('description', {
        header:() => t('table.description'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.DESCRIPTION,
        maxSize: COLUMN_WIDTHS.DESCRIPTION,
        size: COLUMN_WIDTHS.DESCRIPTION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DESCRIPTION}px] break-words` },
      }),

      columnHelper.accessor('foundedYear', {
        header: () => t('table.foundedYear'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.FOUNDED_YEAR,
        maxSize: COLUMN_WIDTHS.FOUNDED_YEAR,
        size: COLUMN_WIDTHS.FOUNDED_YEAR,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.FOUNDED_YEAR}px]` },
      }),

      columnHelper.accessor('country', {
        header: () => <FilterableHeader column="country" label={t('table.country')} onFilter={handleColumnFilter} filterOptions={getCountryFilterOptions()} currentFilter={filters?.countryId} />,
        cell: ({ row }) => row.original.country?.name || '-',
        minSize: COLUMN_WIDTHS.COUNTRY,
        maxSize: COLUMN_WIDTHS.COUNTRY,
        size: COLUMN_WIDTHS.COUNTRY,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COUNTRY}px] break-words` },
      }),

      columnHelper.accessor('region', {
        header: () => (
          <FilterableHeader
            column="region"
            label={t('table.region')}
            onFilter={handleColumnFilter}
            filterOptions={regionFilterOptions}
            currentFilter={filters?.regionId}
            filterDisabled={!filters?.countryId || regionsLoading}
          />
        ),
        cell: ({ row }) => row.original.region?.name || '-',
        minSize: COLUMN_WIDTHS.REGION,
        maxSize: COLUMN_WIDTHS.REGION,
        size: COLUMN_WIDTHS.REGION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.REGION}px] break-words` },
      }),
    ],
    [onEdit, onConfirm, t, handleColumnFilter, filters, getCountryFilterOptions, regionFilterOptions, regionsLoading]
  ) as ColumnDef<IWinery>[]
}
