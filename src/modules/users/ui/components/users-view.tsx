import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ConfirmModal } from '@/modals/confirmModal'
import { Input } from '@/UIKit/shadcn/ui/input.tsx'
import { useUsers } from '../../presenters/useUsers'
import { useUserColumns } from '../../presenters/useUserColumns'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { UserFilters } from './user-filters'
import { LINKS } from '@/constatnts/navigation'
import { MOCK_USERS } from '../../entity/mock'
import { ContentLayout } from '@/layout/components/content-layout'

export const UsersView = () => {
  const { t } = useTranslation('users')
  const navigate = useNavigate()

  const users = MOCK_USERS

  const { filters, onChangeSearch, onChangePagination, modal } = useUsers()
  const columns = useUserColumns({ onConfirmCategory: modal.open })
  const { table } = useDataTable(users?.rows ?? [], columns)

  console.log(users)

  return (
    <ContentLayout title={t('users')}>
      <NLTDataTable
        table={table}
        rowClassname="hover:bg-muted/50 text-center"
        ToolBar={
          <UserFilters filterSearch={filters.search} onChangeFilterSearch={onChangeSearch} />
        }
        onRowClick={row => navigate(LINKS.users.detailUrl(row.id))}
      />
      <NLTTablePagination
        limit={filters.limit}
        offset={filters.offset}
        totalRows={users?.count || 0}
        setOffset={onChangePagination}
      />
      <ConfirmModal
        title={t('modal.title')}
        actionTitle={t('modal.change')}
        variant="submit"
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSubmit={modal.confirm}
      >
        <div className="p-[1px]">
          <Input
            value={modal.note}
            onChange={event => modal.setNote(event.target.value)}
            placeholder={t('modal.reasonPlaceholder')}
          />
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
