import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { useEventList } from '../../presenters/useEventList'
import { useEventColumns } from '../../presenters/useEventsColumns'
import { cn } from '@/lib/utils'
import { getEventDetailPath } from '@/navigation/paths'
import { ContentLayout } from '@/layout/components/content-layout'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { EVENT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WarningModal } from '@/modals/warningModal'

export const EventsView = () => {
  const { t } = useTranslation('events')
  const navigate = useNavigate()

  const { events, filters, onChangeSearch, handleClearSearch, onChangePagination, deleteModal, searchValue, isLoading, totalCount, columnFilters, clearColumnFilters, deleteEvent } = useEventList()

  const hasActiveFilters = useMemo(() => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value !== null && value !== undefined)
    const hasSorting = filters.sortBy !== undefined && filters.sortBy !== ''
    return hasColumnFilters || hasSorting
  }, [columnFilters])

  const columns = useEventColumns({ onEdit: event => navigate(`${getEventDetailPath(event.id)}?edit=true`), onDelete: deleteEvent })
  const { table } = useDataTable(events ?? [], columns)

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(getEventDetailPath(wineId))
  }

  return (
    <ContentLayout title={t('event_list')}>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          hasActiveFilters={hasActiveFilters}
          clearColumnFilters={clearColumnFilters}
          rowClassname="text-center cursor-pointer"
          ToolBar={
            <div className="flex-1 items-center space-x-2">
              <SearchInput value={searchValue} onChange={onChangeSearch} handleClear={handleClearSearch} placeholder={t('search')} className="w-full" />
            </div>
          }
          onRowClick={handleRowClick}
        />
      </div>

      {totalCount && totalCount > EVENT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('event_delete')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: `${deleteModal.theme}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
