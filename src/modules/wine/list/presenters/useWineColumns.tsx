import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { IWines } from '../entities/types/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/UIKit/shadcn/ui/checkbox'
import { useWineFilters } from './useWineFilters'
import { useWineList } from './useWineList'
import { SortableHeader } from '../ui/components/table-headers/sortable-header'
import { FilterableHeader } from '../ui/components/table-headers/filterable-header'
import { SortableFilterableHeader } from '../ui/components/table-headers/filterable-sortable-header'
import { useRegionOptions } from '../../create-wine/presenters/useRegionOptions'

const columnHelper = createColumnHelper<IWines>()

interface WineTableProps {
  onEdit: (wine: IWines) => void
  onDelete: (wineId: string, name: string) => void
  onConfirm: (wineId?: string) => void
}

export const useWineColumns = ({ onEdit, onDelete, onConfirm }: WineTableProps) => {
  const { t } = useTranslation('wines')

  const { sortBy, handleSort, handleColumnFilter, filters } = useWineList()

  const { getColorFilterOptions, getTypeFilterOptions, getVintageFilterOptions, getCountryFilterOptions } = useWineFilters()

  const {
    fetchOptions: fetchRegionOptions,
    regions,
    isLoading: regionsLoading,
  } = useRegionOptions({
    countryId: filters?.countryId,
  })

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
        header: () => {
          return (
            <div className="w-[50px] mx-auto">
              <p>{t('table.actions')}</p>
            </div>
          )
        },

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
            <div className="flex items-center">
              <div className="pt-1 pr-3" onClick={e => stopEvent(e)}>
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={value => {
                    row.toggleSelected(!!value)
                  }}
                  aria-label="Select row"
                  disabled={false}
                  className="h-5 w-5"
                />
              </div>

              <Button variant="ghost" size="sm" onClick={handleEditWine} className="h-8 w-8 p-0 flex-1">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteWine} className="h-8 w-8 p-0 text-destructive hover:text-destructive flex-1">
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </div>
          )
        },
        size: 150,
        meta: { cellClassName: 'text-center' },
      }),
      columnHelper.accessor('name', {
        header: () => <SortableHeader column="name" label={t('table.winename')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('color', {
        header: () => <FilterableHeader column="color" label={t('table.color')} onFilter={handleColumnFilter} filterOptions={getColorFilterOptions()} currentFilter={filters?.colorId} />,

        cell: info => {
          const color = info.getValue()
          return color?.name || '-'
        },
        size: 200,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('producer', {
        header: () => <SortableHeader column="producer" label={t('table.producertitle')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('grapeVariety', {
        header: () => <SortableHeader column="grapeVariety" label={t('table.grapevariety')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        size: 150,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor('type', {
        header: () => <FilterableHeader column="type" label={t('table.type')} onFilter={handleColumnFilter} filterOptions={getTypeFilterOptions()} currentFilter={filters?.typeId} />,
        cell: info => {
          const type = info.getValue()
          return type?.name || '-'
        },
        size: 120,
        meta: { cellClassName: 'text-start' },
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
        size: 140,
        meta: { cellClassName: 'text-start' },
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
        cell: ({ row }) => {
          return <div>{row.original.country?.name || '-'}</div>
        },
        size: 140,
        meta: { cellClassName: 'text-start' },
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
        cell: ({ row }) => {
          return <div>{row.original.region?.name || '-'}</div>
        },
        size: 140,
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.display({
        id: 'images',
        header: () => {
          return <span> {t('table.images')}</span>
        },
        cell: ({ row }) => {
          return <div>{row.original.image ? '+' : '-'}</div>
        },
        size: 120,
        meta: { cellClassName: 'text-center' },
      }),
    ],
    [onEdit, onDelete, onConfirm, t]
  ) as ColumnDef<IWines>[]
}
