import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { MouseEvent, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Edit, Image, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IPartner, PARTNER_STATUS, PartnerFilters } from '../entities/types'
import { FilterableHeader } from '@/UIKit/app-components/table-headers/filterable-header'

const columnHelper = createColumnHelper<IPartner>()

export interface IFilterParams {
  handleColumnFilter: (column: string, value: any) => void
  filters?: PartnerFilters | null
}

interface PartnerTableProps {
  onEdit: (partner: IPartner) => void
  onDelete: (partnerId: number, name: string) => void
  filterParams: IFilterParams
}

const COLUMN_WIDTHS = {
  ACTIONS: 90,
  LOGO: 90,
  NAME: 240,
  WEBSITE: 260,
  STATUS: 140,
  COUNTRIES: 320,
} as const

export const usePartnerColumns = ({ onEdit, onDelete, filterParams }: PartnerTableProps) => {
  const { t } = useTranslation('partners')

  return useMemo(
    () =>
      [
        columnHelper.display({
          id: 'actions',
          header: () => <p className="text-center">{t('table.actions')}</p>,
          cell: ({ row }) => {
            const stopEvent = (event: MouseEvent) => {
              event.stopPropagation()
              event.preventDefault()
            }

            const handleEdit = (event: MouseEvent) => {
              stopEvent(event)
              onEdit(row.original)
            }

            const handleDelete = (event: MouseEvent) => {
              stopEvent(event)
              onDelete(row.original.id, row.original.name || t('unknown_partner'))
            }

            return (
              <div className="flex items-center justify-around">
                <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete} className="h-8 w-8 p-0">
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
        columnHelper.display({
          id: 'logo',
          header: () => <p className="text-center">{t('table.logo')}</p>,
          cell: ({ row }) => {
            const logoUrl = row.original.logo?.smallUrl || row.original.logo?.mediumUrl || row.original.logo?.originalUrl
            return logoUrl ? (
              <img src={logoUrl} alt={row.original.name} className="mx-auto h-12 w-12 rounded-md bg-muted p-1 object-contain" />
            ) : (
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                <Image className="h-5 w-5 text-muted-foreground" />
              </div>
            )
          },
          minSize: COLUMN_WIDTHS.LOGO,
          maxSize: COLUMN_WIDTHS.LOGO,
          size: COLUMN_WIDTHS.LOGO,
          meta: { cellClassName: 'text-center' },
        }),
        columnHelper.accessor('name', {
          header: () => t('table.name'),
          cell: info => info.getValue() || '-',
          minSize: COLUMN_WIDTHS.NAME,
          maxSize: COLUMN_WIDTHS.NAME,
          size: COLUMN_WIDTHS.NAME,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px] break-words` },
        }),
        columnHelper.accessor('website', {
          header: () => t('table.website'),
          cell: info => {
            const website = info.getValue()
            if (!website) return '-'
            return (
              <a href={website} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()} className="text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline">
                {website}
              </a>
            )
          },
          minSize: COLUMN_WIDTHS.WEBSITE,
          maxSize: COLUMN_WIDTHS.WEBSITE,
          size: COLUMN_WIDTHS.WEBSITE,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.WEBSITE}px] break-words` },
        }),
        columnHelper.accessor('status', {
          header: () => (
            <FilterableHeader
              column="status"
              label={t('table.status')}
              onFilter={filterParams.handleColumnFilter}
              filterOptions={[
                { value: PARTNER_STATUS.ACTIVE, label: t('status.active') },
                { value: PARTNER_STATUS.INACTIVE, label: t('status.inactive') },
              ]}
              currentFilter={filterParams.filters?.status}
            />
          ),
          cell: info => {
            const status = info.getValue()
            return <Badge className={cn('capitalize', status === PARTNER_STATUS.ACTIVE ? 'bg-green-600 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-600')}>{t(`status.${status}`)}</Badge>
          },
          minSize: COLUMN_WIDTHS.STATUS,
          maxSize: COLUMN_WIDTHS.STATUS,
          size: COLUMN_WIDTHS.STATUS,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.STATUS}px]` },
        }),
        columnHelper.display({
          id: 'countries',
          header: () => t('table.countries'),
          cell: ({ row }) => row.original.countries?.map(country => country.name).join(', ') || row.original.countryIds?.join(', ') || '-',
          minSize: COLUMN_WIDTHS.COUNTRIES,
          maxSize: COLUMN_WIDTHS.COUNTRIES,
          size: COLUMN_WIDTHS.COUNTRIES,
          meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COUNTRIES}px] break-words` },
        }),
      ] as ColumnDef<IPartner>[],
    [onDelete, onEdit, t]
  )
}
