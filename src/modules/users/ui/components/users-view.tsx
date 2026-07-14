import { useTranslation } from 'react-i18next'
import { useUsers } from '../../presenters/useUsers'
import { useUserColumns } from '../../presenters/useUserColumns'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { UserFilters } from './user-filters'
import { ConfirmModal } from '@/modals/confirmModal'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'

export const UsersView = () => {
  const { t } = useTranslation('users')
  const navigate = useNavigate()

  const { users, filters, onChangeSearch, handleClearSearch, onChangePagination, modal, searchValue, userToConfirm, totalCount } = useUsers()
  const columns = useUserColumns({ onConfirmCategory: modal.open })
  const { table } = useDataTable(users ?? [], columns)

  const modalActionTitle = userToConfirm.isConfirm ? t('modal.cancel_action') : t('modal.confirm_action')

  const modalMessage = userToConfirm.isConfirm
    ? t('modal.cancel_actions', {
        slug: userToConfirm.userFullName,
        category: t(`${userToConfirm.category}`),
      })
    : t('modal.confirm_actions', {
        slug: userToConfirm.userFullName,
        category: t(`${userToConfirm.category}`),
      })

  const handleRowClick = (row: any) => {
    const userId = row.original.id
    navigate(PATHS.USERS_DETAIL.replace(':id', userId))
  }

  return (
    <ContentLayout title={t('users')}>
      <div className="pb-2">
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={<UserFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
          onRowClick={handleRowClick}
        />
      </div>
      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} /> : null}
      <ConfirmModal
        title={t('modal.confirm_title')}
        actionTitle={modalActionTitle}
        variant="submit"
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSubmit={!userToConfirm.isConfirm ? modal.confirm : modal.reject}
      >
        <div className="p-px">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
