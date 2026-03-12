import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEventList } from '../../presenters/useEventList'
import { useEffect, useMemo } from 'react'
import { useEventColumns } from '../../presenters/useEventsColumns'
import { getEventDetailPath } from '@/navigation/paths'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WarningModal } from '@/modals/warningModal'
import { ConfirmModal } from '@/modals/confirmModal'

export const EventsView = () => {
  const { t } = useTranslation('events')
  const navigate = useNavigate()

  const {
    events,
    filters,
    onChangeSearch,
    handleClearSearch,
    onChangePagination,
    deleteModal,
    searchValue,
    deleteWine,
    eventToConfirm,
    confirmModal,
    isLoading,
    totalCount,
    columnFilters,
    clearColumnFilters,
    sortBy,
  } = useEventList()

  const hasActiveFilters = useMemo(() => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value !== null && value !== undefined)
    return hasColumnFilters || !!sortBy
  }, [columnFilters, sortBy])

  const columns = useEventColumns({ onEdit: event => navigate(`${getEventDetailPath(event.id)}?edit=true`, { state: { event } }), onDelete: deleteWine, onCancel: confirmModal.open })
  const { table } = useDataTable(events ?? [], columns)

  const modalActionTitle = eventToConfirm.isCanceled ? t('list.cancel_action') : t('list.confirm_action')

  const modalMessage = eventToConfirm.isCanceled ? t('list.cancel_actions', { slug: eventToConfirm.theme }) : t('list.confirm_actions', { slug: eventToConfirm.theme })

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

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('event_delete')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: `${deleteModal.theme}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
      <ConfirmModal
        title={t('cancel_title')}
        actionTitle={modalActionTitle}
        variant="submit"
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onSubmit={!eventToConfirm.isCanceled ? confirmModal.confirmCancel : confirmModal.reject}
      >
        <div className="p-px">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
