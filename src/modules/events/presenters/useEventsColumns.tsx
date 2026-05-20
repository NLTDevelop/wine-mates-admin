import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEventList } from './useEventList'
import { useEventFilters } from './useEventFilters'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { FilterableHeader } from '@/UIKit/app-components/table-headers/filterable-header'
import { IEvent } from '../entities/types/IEvent'
import { DateFilterHeader } from '@/UIKit/app-components/table-headers/date-filter-header'
import { RangeFilterHeader } from '@/UIKit/app-components/table-headers/range-filter-header'
import { format, parse } from 'date-fns'
import { SortableHeader } from '@/UIKit/app-components/table-headers/sortable-header'

const columnHelper = createColumnHelper<IEvent>()

interface EventTableProps {
  onEdit: (event: IEvent) => void
  onDelete: (eventId: number, name: string) => void
}

const COLUMN_WIDTHS = {
  ACTIONS: 80,
  THEME: 260,
  RESTAURANT: 180,
  LOCATION: 300,
  DATE: 175,
  TIME: 150,
  PRICE: 160,
  CURRENCY: 100,
  SPEAKER: 180,
  LANGUAGE: 100,
  SEATS: 150,
  TYPE: 180,
  COUNTRY: 140,
  ISACTIVE: 140,
  CREATED: 160,
} as const

export const useEventColumns = ({ onEdit, onDelete }: EventTableProps) => {
  const { t } = useTranslation('events')

  const { handleColumnFilter, handleDateFilter, handlePriceFilter, handleSort, filters, sortBy } = useEventList()

  const {
    getIsActiveFilterOptions,
    getCountryFilterOptions,
    getTypeFilterOptions,
    getRequiresConfirmationFilterOptions,
    getTastingTypeFilterOptions,
    getLanguageFilterOptions,
    getCurrencyFilterOptions,
  } = useEventFilters()

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
            onEdit(row.original)
          }

          const handleDeleteEvent = (e: React.MouseEvent) => {
            stopEvent(e)
            row.original.id && onDelete(row.original.id, row.original.theme || t('not_known_event'))
          }

          return (
            <div className="flex items-center justify-around">
              <Button variant="ghost" size="sm" onClick={handleEditEvent} className="h-8 w-8 p-0">
                <Edit className="h-4 w-4 text-green-600" />
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
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.THEME}px] break-words` },
      }),

      columnHelper.accessor('restaurantName', {
        header: () => <SortableHeader column="restaurant" label={t('table.restaurant_name')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => {
          const restaurantName = info.getValue()
          return restaurantName || '-'
        },
        minSize: COLUMN_WIDTHS.RESTAURANT,
        maxSize: COLUMN_WIDTHS.RESTAURANT,
        size: COLUMN_WIDTHS.RESTAURANT,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.RESTAURANT}px] break-words` },
      }),

      columnHelper.accessor('locationLabel', {
        header: () => <SortableHeader column="location" label={t('table.location_label')} sortBy={sortBy} onSort={handleSort} />,
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.LOCATION,
        maxSize: COLUMN_WIDTHS.LOCATION,
        size: COLUMN_WIDTHS.LOCATION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.LOCATION}px] break-words` },
      }),

      columnHelper.accessor('eventDate', {
        header: () => (
          <DateFilterHeader
            column="eventDate"
            label={t('table.event_date')}
            onFilter={(_, val) => handleDateFilter(val.dateFrom, val.dateTo)}
            currentFrom={filters?.dateFrom}
            currentTo={filters?.dateTo}
            onSort={handleSort}
            sortBy={filters.sortBy}
          />
        ),
        cell: info => {
          const dateStart = parse(info.row.original.eventStartDate, 'yyyy-MM-dd', new Date())
          const dateEnd = parse(info.row.original.eventEndDate, 'yyyy-MM-dd', new Date())
          return `${format(dateStart, 'dd.MM.yy')} - ${format(dateEnd, 'dd.MM.yy')}` || '-'
        },
        minSize: COLUMN_WIDTHS.DATE,
        maxSize: COLUMN_WIDTHS.DATE,
        size: COLUMN_WIDTHS.DATE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DATE}px]` },
      }),

      columnHelper.accessor('eventTime', {
        header: t('table.event_time'),
        cell: info => {
          const timeStart = parse(info.row.original.eventStartTime, 'HH:mm:ss', new Date())
          const timeEnd = parse(info.row.original.eventEndTime, 'HH:mm:ss', new Date())
          return `${format(timeStart, 'HH:mm')} - ${format(timeEnd, 'HH:mm')}` || '-'
        },
        minSize: COLUMN_WIDTHS.TIME,
        maxSize: COLUMN_WIDTHS.TIME,
        size: COLUMN_WIDTHS.TIME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TIME}px]` },
      }),

      columnHelper.accessor('priceUsd', {
        header: () => (
          <RangeFilterHeader
            column="price"
            label={t('table.price')}
            onFilter={(_, val) => handlePriceFilter({ minPrice: val.min, maxPrice: val.max })}
            currentMin={filters?.minPrice}
            currentMax={filters?.maxPrice}
            onSort={handleSort}
            sortBy={sortBy}
          />
        ),
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
        header: t('table.speaker_name'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.SPEAKER,
        maxSize: COLUMN_WIDTHS.SPEAKER,
        size: COLUMN_WIDTHS.SPEAKER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SPEAKER}px] break-words` },
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
        header: () => <SortableHeader column="seats" label={t('table.seats')} sortBy={filters?.sortBy} onSort={handleSort} />,
        cell: info => `${info.row.original.seats.total} (${t('left_place', { count: info.row.original.seats.left })})` || '-',
        minSize: COLUMN_WIDTHS.SEATS,
        maxSize: COLUMN_WIDTHS.SEATS,
        size: COLUMN_WIDTHS.SEATS,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SEATS}px]` },
      }),

      columnHelper.accessor('eventType', {
        header: () => <FilterableHeader column="eventType" label={t('table.event_type')} onFilter={handleColumnFilter} filterOptions={getTypeFilterOptions()} currentFilter={filters?.eventType} />,
        cell: info => {
          const type = info.getValue()
          return t(`event_types.${type}`) || '-'
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TYPE}px]` },
      }),
      columnHelper.accessor('tastingType', {
        header: () => (
          <FilterableHeader column="tastingType" label={t('table.tasting_type')} onFilter={handleColumnFilter} filterOptions={getTastingTypeFilterOptions()} currentFilter={filters?.tastingType} />
        ),
        cell: info => {
          const type = info.getValue()
          return t(`tasting_types.${type}`) || '-'
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TYPE}px]` },
      }),

      columnHelper.accessor('isActive', {
        header: () => <FilterableHeader column="isActive" label={t('table.isActive')} onFilter={handleColumnFilter} filterOptions={getIsActiveFilterOptions()} currentFilter={filters?.isActive} />,
        cell: info => {
          return info.getValue() ? t('active_event') : t('inactive')
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.ISACTIVE}px]` },
      }),
      columnHelper.accessor('requiresConfirmation', {
        header: () => (
          <FilterableHeader
            column="requiresConfirmation"
            label={t('table.requiresConfirmation')}
            onFilter={handleColumnFilter}
            filterOptions={getRequiresConfirmationFilterOptions()}
            currentFilter={filters?.requiresConfirmation}
          />
        ),
        cell: info => {
          return info.getValue() ? t('requires') : t('not_requires')
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.ISACTIVE}px]` },
      }),

      columnHelper.accessor('createdAt', {
        header: () => <SortableHeader column="createdAt" label={t('table.createdAt')} /*sortOrder={filters?.sortOrder}*/ sortBy={filters?.sortBy} onSort={handleSort} />,
        cell: info => {
          const dateString = info.getValue()
          return dateString ? format(new Date(dateString), 'dd.MM.yyyy') : '-'
        },
        minSize: COLUMN_WIDTHS.TYPE,
        maxSize: COLUMN_WIDTHS.TYPE,
        size: COLUMN_WIDTHS.TYPE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.CREATED}px]` },
      }),

      columnHelper.accessor('country', {
        header: () => <FilterableHeader column="countryId" label={t('table.country')} onFilter={handleColumnFilter} filterOptions={getCountryFilterOptions()} currentFilter={filters?.countryId} />,
        cell: ({ row }) => row.original.country?.name || '-',
        minSize: COLUMN_WIDTHS.COUNTRY,
        maxSize: COLUMN_WIDTHS.COUNTRY,
        size: COLUMN_WIDTHS.COUNTRY,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COUNTRY}px]` },
      }),
    ],
    [onEdit, onDelete, t, handleColumnFilter, handleDateFilter, handlePriceFilter, filters, getIsActiveFilterOptions, getCountryFilterOptions]
  ) as ColumnDef<IEvent>[]
}
