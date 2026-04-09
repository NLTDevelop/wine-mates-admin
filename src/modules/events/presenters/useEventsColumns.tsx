import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEventList } from './useEventList'
import { useEventFilters } from './useEventFilters'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Info, Trash2 } from 'lucide-react'
import { FilterableHeader } from '@/UIKit/app-components/table-headers/filterable-header'
import { IEvent } from '../entities/types'
import { DateFilterHeader } from '@/UIKit/app-components/table-headers/date-filter-header'
import { RangeFilterHeader } from '@/UIKit/app-components/table-headers/range-filter-header'
import { format } from 'date-fns'

const columnHelper = createColumnHelper<IEvent>()

interface EventTableProps {
  onDetail: (event: IEvent) => void
  onDelete: (eventId: number, name: string) => void
}

const COLUMN_WIDTHS = {
  ACTIONS: 80,
  THEME: 260,
  RESTAURANT: 180,
  LOCATION: 300,
  DATE: 150,
  TIME: 120,
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

export const useEventColumns = ({ onDetail, onDelete }: EventTableProps) => {
  const { t } = useTranslation('events')

  const { handleColumnFilter, handleDateFilter, handlePriceFilter, filters } = useEventList()

  const { getIsActiveFilterOptions, getCountryFilterOptions } = useEventFilters()

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
            onDetail(row.original)
          }

          const handleDeleteEvent = (e: React.MouseEvent) => {
            stopEvent(e)
            row.original.id && onDelete(row.original.id, row.original.theme || t('not_known_event'))
          }

          return (
            <div className="flex items-center justify-around">
              <Button variant="ghost" size="sm" onClick={handleEditEvent} className="h-8 w-8 p-0">
                <Info className="h-4 w-4 text-green-600" />
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
        header: t('table.theme'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.THEME,
        maxSize: COLUMN_WIDTHS.THEME,
        size: COLUMN_WIDTHS.THEME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.THEME}px]` },
      }),

      columnHelper.accessor('restaurantName', {
        header: t('table.restaurant_name'),
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
        header: t('table.location_label'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.LOCATION,
        maxSize: COLUMN_WIDTHS.LOCATION,
        size: COLUMN_WIDTHS.LOCATION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.LOCATION}px]` },
      }),

      columnHelper.accessor('eventDate', {
        header: () => (
          <DateFilterHeader
            column="event_date"
            label={t('table.event_date')}
            onFilter={(_, val) => handleDateFilter(val.dateFrom, val.dateTo)}
            currentFrom={filters?.dateFrom}
            currentTo={filters?.dateTo}
          />
        ),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.DATE,
        maxSize: COLUMN_WIDTHS.DATE,
        size: COLUMN_WIDTHS.DATE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DATE}px]` },
      }),

      columnHelper.accessor('eventTime', {
        header: t('table.event_time'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.TIME,
        maxSize: COLUMN_WIDTHS.TIME,
        size: COLUMN_WIDTHS.TIME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.TIME}px]` },
      }),

      columnHelper.accessor('priceUsd', {
        header: () => (
          <RangeFilterHeader
            column="priceUsd"
            label={t('table.price')}
            onFilter={(_, val) =>
              handlePriceFilter({
                minPrice: val.min,
                maxPrice: val.max,
              })
            }
            currentMin={filters?.minPrice}
            currentMax={filters?.maxPrice}
          />
        ),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.PRICE,
        maxSize: COLUMN_WIDTHS.PRICE,
        size: COLUMN_WIDTHS.PRICE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.PRICE}px]` },
      }),

      columnHelper.accessor('speakerName', {
        header: t('table.speaker_name'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.SPEAKER,
        maxSize: COLUMN_WIDTHS.SPEAKER,
        size: COLUMN_WIDTHS.SPEAKER,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SPEAKER}px]` },
      }),

      columnHelper.accessor('language', {
        header: t('table.language'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.LANGUAGE,
        maxSize: COLUMN_WIDTHS.LANGUAGE,
        size: COLUMN_WIDTHS.LANGUAGE,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.LANGUAGE}px]` },
      }),

      columnHelper.accessor('seats', {
        header: t('table.seats'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.SEATS,
        maxSize: COLUMN_WIDTHS.SEATS,
        size: COLUMN_WIDTHS.SEATS,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.SEATS}px]` },
      }),

      columnHelper.accessor('tastingType', {
        header: t('table.type'),
        cell: info => {
          const type = info.getValue()
          return t(`event_types.${type}`) || '-'
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

      columnHelper.accessor('createdAt', {
        header: t('table.createdAt'),
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
    [onDetail, onDelete, t, handleColumnFilter, handleDateFilter, handlePriceFilter, filters, getIsActiveFilterOptions, getCountryFilterOptions]
  ) as ColumnDef<IEvent>[]
}
