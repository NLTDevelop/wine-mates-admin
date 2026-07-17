import { Badge } from '@/UIKit/shadcn/ui/badge'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IUserOfUserRequest, USER_REQUESTS_STATUS, UserRequestType } from '../entities/types'
import { FilterableHeader } from '@/UIKit/app-components/table-headers/filterable-header'
import { useUserRequestsList } from './useUserRequestsList'
import { format } from 'date-fns'
import { IFile } from '@/modules/users/entities/IUser'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Trash2 } from 'lucide-react'

interface IRow {
  id: string
  subject: string
  description: string
  user: IUserOfUserRequest
  createdAt: string
  status: UserRequestType
  adminComment: string
  closedAt: string
  email: string
  firstName: string
  lastName: string
  file: IFile
}

const COLUMN_WIDTHS = {
  id: 80,
  NAME: 200,
  DESCRIPTION: 300,
  EMAIL: 250,
  COMMENT: 250,
  IMAGES: 120,
  ACTIONS: 80,
} as const

export const userRequestStatusVariant = {
  OPEN: 'bg-[#BE2841] text-[#fff]',
  IN_PROGRESS: 'bg-[#FF9D0020] text-[#FF9D00]',
  CLOSED: 'bg-[#4CAF5020] text-[#4CAF50]',
}

export const useUserRequestsColumns = ({ onDelete }: { onDelete?: (requestId: number, subject: string) => void }) => {
  const columnHelper = createColumnHelper<IRow>()
  const { t } = useTranslation('user_requests')

  const { handleColumnFilter, filters } = useUserRequestsList()

  const statusFilterOptions = () => {
    return [
      { label: t(`statuses.${USER_REQUESTS_STATUS.OPEN.toLowerCase()}`), value: t(`statuses.${USER_REQUESTS_STATUS.OPEN.toLowerCase()}`) },
      { label: t(`statuses.${USER_REQUESTS_STATUS.IN_PROGRESS.toLowerCase()}`), value: t(`statuses.${USER_REQUESTS_STATUS.IN_PROGRESS.toLowerCase()}`) },
      { label: t(`statuses.${USER_REQUESTS_STATUS.CLOSED.toLowerCase()}`), value: t(`statuses.${USER_REQUESTS_STATUS.CLOSED.toLowerCase()}`) },
    ]
  }

  return useMemo(
    () => [
      columnHelper.accessor('subject', {
        header: () => t('table.subject'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.NAME,
        maxSize: COLUMN_WIDTHS.NAME,
        size: COLUMN_WIDTHS.NAME,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.NAME}px] break-words` },
      }),
      columnHelper.accessor('description', {
        header: () => t('table.description'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.DESCRIPTION,
        maxSize: COLUMN_WIDTHS.DESCRIPTION,
        size: COLUMN_WIDTHS.DESCRIPTION,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.DESCRIPTION}px] break-words` },
      }),

      columnHelper.accessor('createdAt', {
        header: () => t('table.createdAt'),
        cell: info => {
          const dateString = info.getValue()
          return dateString ? format(new Date(dateString), 'dd.MM.yyyy') : '-'
        },
        meta: { cellClassName: 'text-start' },
      }),
      columnHelper.accessor(row => `${row.lastName || ''} ${row.firstName || ''}`.trim(), {
        header: t('table.username'),
        cell: info => {
          const lastName = info.row.original.user.lastName || ''
          const firstName = info.row.original.user.firstName || ''
          const fullName = `${lastName} ` + firstName
          const displayName = fullName || t('table.anonymous')

          return <span className={!fullName ? 'text-gray-400' : ''}>{displayName}</span>
        },
        meta: { cellClassName: 'text-start' },
      }),

      columnHelper.accessor('email', {
        header: t('table.email'),
        cell: info => info.row.original.user.email || '-',
        minSize: COLUMN_WIDTHS.EMAIL,
        maxSize: COLUMN_WIDTHS.EMAIL,
        size: COLUMN_WIDTHS.EMAIL,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.EMAIL}px] break-all` },
      }),

      columnHelper.accessor('status', {
        id: 'status',
        header: () => <FilterableHeader column="status" label={t('table.status')} onFilter={handleColumnFilter} filterOptions={statusFilterOptions()} currentFilter={filters?.status} />,
        cell: info => {
          const status = info.getValue() || ''
          return (
            <div className="text-start">
              <Badge className={`font-semibold cursor-default hover:bg-transparent ${status && userRequestStatusVariant[status]}`}>{t(`statuses.${status.toLowerCase()}`)}</Badge>
            </div>
          )
        },
        meta: { cellClassName: 'w-1/6' },
      }),

      columnHelper.accessor('closedAt', {
        header: () => t('table.closedAt'),
        cell: info => {
          const dateString = info.getValue()
          return dateString ? format(new Date(dateString), 'dd.MM.yyyy') : '-'
        },
        meta: { cellClassName: 'text-start' },
      }),

      columnHelper.display({
        id: 'images',
        header: () => <span>{t('table.file')}</span>,
        cell: ({ row }) => {
          const doc = row.original

          if (doc.file) {
            return <img src={doc.file.smallUrl} alt={doc.file.name} className="w-8 h-12 object-cover" />
          }

          return <div className="w-8 h-12 bg-inherit flex items-center justify-center text-gray-400 text-xs">-</div>
        },
        minSize: COLUMN_WIDTHS.IMAGES,
        maxSize: COLUMN_WIDTHS.IMAGES,
        size: COLUMN_WIDTHS.IMAGES,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.IMAGES}px]` },
      }),

      columnHelper.accessor('adminComment', {
        header: () => t('table.adminComment'),
        cell: info => info.getValue() || '-',
        minSize: COLUMN_WIDTHS.COMMENT,
        maxSize: COLUMN_WIDTHS.COMMENT,
        size: COLUMN_WIDTHS.COMMENT,
        meta: { cellClassName: `text-start w-[${COLUMN_WIDTHS.COMMENT}px] break-words` },
      }),

      columnHelper.display({
        id: 'actions',
        header: () => <p className="text-center">{t('table.actions')}</p>,
        cell: ({ row }) => {
          const handleDelete = (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            row.original.id && onDelete?.(parseInt(row.original.id), row.original.subject)
          }

          return (
            <div className="flex items-center justify-around">
              <Button variant="ghost" size="sm" onClick={handleDelete} className="h-8 w-8 p-0 text-destructive">
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
    ],
    [columnHelper]
  )
}
