import { useTranslation } from 'react-i18next'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useWineList } from '@/modules/wine/list/presenters/useWineList'
import { WarningModal } from '@/modals/warningModal'
import { useEventsColumns } from '../../presenters/useEventsColumns'
import { EventsFilters } from './events-filters'

export const EventsView = () => {
  const { t } = useTranslation('events')
  const navigate = useNavigate()

  const { wines, filters, onChangeSearch, handleClearSearch, onChangePagination, deleteModal, searchValue, deleteWine, wineToConfirm, confirmModal, importWines, isLoading, totalCount } = useWineList()
  const columns = useEventsColumns({ onEdit: wine => navigate(`/wines/${wine.id}?edit=true`), onDelete: deleteWine, onConfirm: confirmModal.open })
  const { table } = useDataTable(wines ?? [], columns)

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(PATHS.WINE_DETAIL.replace(':id', wineId))
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  return (
    <ContentLayout title={t('list')}>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={<EventsFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
          onRowClick={handleRowClick}
        />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('list.wine_delete')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: `${deleteModal.wineName}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
