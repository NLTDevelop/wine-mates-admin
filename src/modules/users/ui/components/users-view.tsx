import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../../presenters/useUsers'
import { useUserColumns } from '../../presenters/useUserColumns'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { UserFilters } from './user-filters'
import { LINKS } from '@/constatnts/navigation'
import { ConfirmModal } from '@/modals/confirmModal'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'

export const UsersView = () => {
  const { t } = useTranslation('users')
  const navigate = useNavigate()

  const { users, filters, onChangeSearch, handleClearSearch, onChangePagination, modal, searchValue, userToConfirm } = useUsers()
  const columns = useUserColumns({ onConfirmCategory: modal.open })
  const { table } = useDataTable(users ?? [], columns)

  return (
    <ContentLayout title={t('users')}>
      <NLTDataTable
        table={table}
        rowClassname="hover:bg-muted/50 text-center"
        ToolBar={<UserFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
        onRowClick={row => navigate(LINKS.users.detailUrl!(row.id))}
      />
      <NLTTablePagination limit={filters.limit} offset={filters.offset} totalRows={users?.length || 0} setOffset={onChangePagination} />
      <ConfirmModal title={t('modal.title')} actionTitle={t('modal.confirm')} variant="submit" isOpen={modal.isOpen} onClose={modal.close} onReject={modal.reject} onSubmit={modal.confirm}>
        <div className="p-[1px]">
          <p>
            {t('modal.confirm_actions', {
              slug: userToConfirm.userFullName,
              category: userToConfirm.wineExperienceLevel,
            })}
          </p>
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
