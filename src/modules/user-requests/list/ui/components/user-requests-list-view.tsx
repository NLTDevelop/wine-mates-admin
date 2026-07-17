import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUserRequestsList } from '../../presenters/useUserRequestsList'
import { useUserRequestsColumns } from '../../presenters/useUserRequestsColumns'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { PATHS } from '@/navigation/paths'
import { ContentLayout } from '@/layout/components/content-layout'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { WarningModal } from '@/modals/warningModal'

export const UserRequestsListView = () => {
  const { t } = useTranslation('user_requests')
  const navigate = useNavigate()

  const { userRequests, filters, onChangeSearch, handleClearSearch, onChangePagination, searchValue, totalCount, deleteModal, deleteRequest } = useUserRequestsList()
  const columns = useUserRequestsColumns({ onDelete: deleteRequest })
  const { table } = useDataTable(userRequests ?? [], columns)

  const handleRowClick = (row: any) => {
    const userId = row.original.id
    navigate(PATHS.USER_REQUEST_DETAILS.replace(':id', userId))
  }

  return (
    <ContentLayout title={t('user_requests')}>
      <div className="pb-2">
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={
            <div className="flex-1 items-center space-x-2">
              <SearchInput value={searchValue} onChange={onChangeSearch} handleClear={handleClearSearch} placeholder={t('search_user_request')} className="w-full" />
            </div>
          }
          onRowClick={handleRowClick}
        />
      </div>
      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('request_delete')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: `${deleteModal.theme}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
