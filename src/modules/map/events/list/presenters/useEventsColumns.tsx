import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SortableHeader } from '@/UIKit/app-components/table-headers/sortable-header'
import { FilterableHeader } from '@/UIKit/app-components/table-headers/filterable-header'
import { useEventFilters } from './useEventFilters'
import { useEventList } from './useEventList'
import { MapEvent } from '../../entities/types'
import { mockEvents } from '@/modules/map/map/entities/mock'

const columnHelper = createColumnHelper<MapEvent>()

interface EventTableProps {
  onEdit: (event: MapEvent) => void
  onDelete: (eventId: number, name: string) => void
  onCancel: (eventId?: number) => void
}

const COLUMN_WIDTHS = {
  ACTIONS: 50,
  THEME: 200,
  RESTAURANT: 180,
  LOCATION: 300,
  DATE: 120,
  TIME: 120,
  PRICE: 100,
  CURRENCY: 100,
  SPEAKER: 180,
  LANGUAGE: 100,
  SEATS: 150,
  TYPE: 180,
  DISTANCE: 100,
} as const

export const useEventColumns = ({ onEdit, onDelete, onCancel }: EventTableProps) => {
  const { t } = useTranslation('events')

  const { sortBy, handleSort, handleColumnFilter, filters } = useEventList()

  const { getCurrencyFilterOptions, getLanguageFilterOptions, getTastingTypeFilterOptions } = useEventFilters()

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

          const handleEditEvent = (e: React.MouseEvent) => {
            stopEvent(e)
            onEdit(mockEvents[0])
            // onEdit(row.original)
          }

          const handleDeleteEvent = (e: React.MouseEvent) => {
            stopEvent(e)
            row.original.id && onDelete(row.original.id, row.original.theme || t('not_known_event'))
          }

          return (
            <div className="flex items-center justify-around">
              <Button variant="ghost" size="sm" onClick={handleEditEvent} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteEvent} className="h-8 w-8 p-0 text-destructive">
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

      columnHelper.accessor('theme', {
        header: () => <SortableHeader column="theme" label={t('table.theme')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.THEME,
        maxSize: COLUMN_WIDTHS.THEME,
        size: COLUMN_WIDTHS.THEME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.THEME}px]` },
      }),

      columnHelper.accessor('restaurantName', {
        header: () => <SortableHeader column="restaurant_name" label={t('table.restaurant_name')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => {
          const restaurantName = info.getValue()
          return restaurantName || '-'
        },
        minSize: COLUMN_WIDTHS.RESTAURANT,
        maxSize: COLUMN_WIDTHS.RESTAURANT,
        size: COLUMN_WIDTHS.RESTAURANT,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.RESTAURANT}px]` },
      }),

      columnHelper.accessor('locationLabel', {
        header: () => <SortableHeader column="location_label" label={t('table.location_label')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.LOCATION,
        maxSize: COLUMN_WIDTHS.LOCATION,
        size: COLUMN_WIDTHS.LOCATION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.LOCATION}px]` },
      }),

      columnHelper.accessor('eventDate', {
        header: () => <SortableHeader column="event_date" label={t('table.event_date')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.DATE,
        maxSize: COLUMN_WIDTHS.DATE,
        size: COLUMN_WIDTHS.DATE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DATE}px]` },
      }),

      columnHelper.accessor('eventTime', {
        header: () => <SortableHeader column="event_time" label={t('table.event_time')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.TIME,
        maxSize: COLUMN_WIDTHS.TIME,
        size: COLUMN_WIDTHS.TIME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TIME}px]` },
      }),

      columnHelper.accessor('price', {
        header: () => <SortableHeader column="price" label={t('table.price')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.PRICE,
        maxSize: COLUMN_WIDTHS.PRICE,
        size: COLUMN_WIDTHS.PRICE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRICE}px]` },
      }),

      columnHelper.accessor('currency', {
        header: () => <FilterableHeader column="currency" label={t('table.currency')} onFilter={handleColumnFilter} filterOptions={getCurrencyFilterOptions()} currentFilter={filters?.currency} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.CURRENCY,
        maxSize: COLUMN_WIDTHS.CURRENCY,
        size: COLUMN_WIDTHS.CURRENCY,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.CURRENCY}px]` },
      }),

      columnHelper.accessor('speakerName', {
        header: () => <SortableHeader column="speaker_name" label={t('table.speaker_name')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.SPEAKER,
        maxSize: COLUMN_WIDTHS.SPEAKER,
        size: COLUMN_WIDTHS.SPEAKER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SPEAKER}px]` },
      }),

      columnHelper.accessor('language', {
        header: () => <FilterableHeader column="language" label={t('table.language')} onFilter={handleColumnFilter} filterOptions={getLanguageFilterOptions()} currentFilter={filters?.language} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.LANGUAGE,
        maxSize: COLUMN_WIDTHS.LANGUAGE,
        size: COLUMN_WIDTHS.LANGUAGE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.LANGUAGE}px]` },
      }),

      columnHelper.accessor('seats', {
        header: () => <SortableHeader column="seats" label={t('table.seats')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.SEATS,
        maxSize: COLUMN_WIDTHS.SEATS,
        size: COLUMN_WIDTHS.SEATS,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SEATS}px]` },
      }),

      columnHelper.accessor('tastingType', {
        header: () => <FilterableHeader column="type" label={t('table.type')} onFilter={handleColumnFilter} filterOptions={getTastingTypeFilterOptions()} currentFilter={filters?.tastingType} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TYPE}px]` },
      }),

      columnHelper.accessor('distanceKm', {
        header: () => <SortableHeader column="distance" label={t('table.distance')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.DISTANCE,
        maxSize: COLUMN_WIDTHS.DISTANCE,
        size: COLUMN_WIDTHS.DISTANCE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DISTANCE}px]` },
      }),
    ],
    [onEdit, onDelete, onCancel, t, sortBy, handleSort, handleColumnFilter, filters, getTastingTypeFilterOptions, getLanguageFilterOptions, getCurrencyFilterOptions]
  ) as ColumnDef<MapEvent>[]
}
