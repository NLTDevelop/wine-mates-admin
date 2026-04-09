import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { IWines } from '../entities/types/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/UIKit/shadcn/ui/checkbox'
import { useWineFilters } from './useWineFilters'
import { useWineList } from './useWineList'
import { SortableHeader } from '../../../../UIKit/app-components/table-headers/sortable-header'
import { FilterableHeader } from '../../../../UIKit/app-components/table-headers/filterable-header'
import { SortableFilterableHeader } from '../../../../UIKit/app-components/table-headers/filterable-sortable-header'
import { useRegionOptions } from '../../create-wine/presenters/useRegionOptions'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
}

const COLUMN_WIDTHS = {
  ACTIONS: 100,
  NAME: 200,
  COLOR: 120,
  PRODUCER: 180,
  GRAPE: 180,
  TYPE: 120,
  VINTAGE: 100,
  COUNTRY: 140,
  REGION: 140,
  IMAGES: 120,
} as const

export const useWineColumns = ({ onEdit, onDelete, onConfirm }: WineTableProps) => {
  const { t } = useTranslation('wines')

  const { sortBy, handleSort, handleColumnFilter, filters } = useWineList()

  const { getColorFilterOptions, getTypeFilterOptions, getVintageFilterOptions, getCountryFilterOptions } = useWineFilters()

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
            row.original.id && onDelete(row.original.id, row.original.name || t('not_known_wine'))
          }

          return (
            <div className="flex items-center justify-around">
              <div className="pt-1 pr-3" onClick={e => stopEvent(e)}>
                <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="h-5 w-5" />
              </div>
              <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </div>
          )
        },
        minSize: COLUMN_WIDTHS.ACTIONS,
        maxSize: COLUMN_WIDTHS.ACTIONS,
        size: COLUMN_WIDTHS.ACTIONS,
        meta: { cellClassName: 'text-center' },
      }),

      columnHelper.accessor('name', {
        header: () => <SortableHeader column="name" label={t('table.winename')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.NAME,
        maxSize: COLUMN_WIDTHS.NAME,
        size: COLUMN_WIDTHS.NAME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px]` },
      }),

      columnHelper.accessor('color', {
        header: () => <FilterableHeader column="color" label={t('table.color')} onFilter={handleColumnFilter} filterOptions={getColorFilterOptions()} currentFilter={filters?.colorId} />,
        cell: info => {
          const color = info.getValue()
          return color?.name || '-'
        },
        minSize: COLUMN_WIDTHS.COLOR,
        maxSize: COLUMN_WIDTHS.COLOR,
        size: COLUMN_WIDTHS.COLOR,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COLOR}px]` },
      }),

      columnHelper.accessor('producer', {
        header: () => <SortableHeader column="producer" label={t('table.producertitle')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.PRODUCER,
        maxSize: COLUMN_WIDTHS.PRODUCER,
        size: COLUMN_WIDTHS.PRODUCER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRODUCER}px]` },
      }),

      columnHelper.accessor('grapeVariety', {
        header: () => <SortableHeader column="grape_variety" label={t('table.grapevariety')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.GRAPE,
        maxSize: COLUMN_WIDTHS.GRAPE,
        size: COLUMN_WIDTHS.GRAPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.GRAPE}px]` },
      }),

      columnHelper.accessor('type', {
        header: () => <FilterableHeader column="type" label={t('table.type')} onFilter={handleColumnFilter} filterOptions={getTypeFilterOptions()} currentFilter={filters?.typeId} />,
        cell: info => {
          const type = info.getValue()
          return type?.name || '-'
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TYPE}px]` },
      }),

      columnHelper.accessor('vintage', {
        header: () => (
          <SortableFilterableHeader
            column="vintage"
            label={t('table.vintageconfig')}
            sortBy={sortBy}
            onSort={handleSort}
            onFilter={handleColumnFilter}
            filterOptions={getVintageFilterOptions()}
            currentFilter={filters?.vintage}
          />
        ),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.VINTAGE,
        maxSize: COLUMN_WIDTHS.VINTAGE,
        size: COLUMN_WIDTHS.VINTAGE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.VINTAGE}px]` },
      }),

      columnHelper.accessor('country', {
        header: () => (
          <SortableFilterableHeader
            column="country"
            label={t('table.country')}
            sortBy={sortBy}
            onSort={handleSort}
            onFilter={handleColumnFilter}
            filterOptions={getCountryFilterOptions()}
            currentFilter={filters?.countryId}
          />
        ),
        cell: ({ row }) => row.original.country?.name || '-',
        minSize: COLUMN_WIDTHS.COUNTRY,
        maxSize: COLUMN_WIDTHS.COUNTRY,
        size: COLUMN_WIDTHS.COUNTRY,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COUNTRY}px]` },
      }),

      columnHelper.accessor('region', {
        header: () => (
          <SortableFilterableHeader
            column="region"
            label={t('table.region')}
            sortBy={sortBy}
            onSort={handleSort}
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
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.REGION}px]` },
      }),

      columnHelper.display({
        id: 'images',
        header: () => <span>{t('table.images')}</span>,
        cell: ({ row }) => <div>{row.original.image ? '+' : '-'}</div>,
        minSize: COLUMN_WIDTHS.IMAGES,
        maxSize: COLUMN_WIDTHS.IMAGES,
        size: COLUMN_WIDTHS.IMAGES,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.IMAGES}px]` },
      }),
    ],
    [
      onEdit,
      onDelete,
      onConfirm,
      t,
      sortBy,
      handleSort,
      handleColumnFilter,
      filters,
      getColorFilterOptions,
      getTypeFilterOptions,
      getVintageFilterOptions,
      getCountryFilterOptions,
      regionFilterOptions,
      regionsLoading,
    ]
  ) as ColumnDef<IWines>[]
}
