import { Row } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/UIKit/shadcn/ui/button'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { PATHS, getPartnerDetailPath } from '@/navigation/paths'
import { WarningModal } from '@/modals/warningModal'
import { IPartner } from '../../entities/types'
import { usePartnerColumns } from '../../presenters/usePartnerColumns'
import { usePartnersList } from '../../presenters/usePartnersList'

export const PartnersView = () => {
  const { t } = useTranslation('partners')
  const navigate = useNavigate()
  const presenter = usePartnersList()
  const columns = usePartnerColumns({
    onEdit: partner => navigate(`${getPartnerDetailPath(partner.id)}?edit=true`),
    onDelete: presenter.deletePartner,
    filterParams: { filters: presenter.filters, handleColumnFilter: presenter.handleColumnFilter },
  })
  const { table } = useDataTable(presenter.partners ?? [], columns)

  const hasActiveFilters = useMemo(() => Boolean(presenter.filters.status), [presenter.filters.status])

  const handleRowClick = (row: Row<IPartner>) => {
    navigate(getPartnerDetailPath(row.original.id))
  }

  return (
    <ContentLayout title={t('partners')}>
      <div className={cn('pb-2', !presenter.isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          hasActiveFilters={hasActiveFilters}
          clearColumnFilters={() => presenter.clearColumnFilters()}
          onRowClick={handleRowClick}
          ToolBar={
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <SearchInput value={presenter.searchValue} onChange={presenter.onChangeSearch} handleClear={presenter.handleClearSearch} placeholder={t('search_partner')} className="w-full" />
              </div>
              <Button type="button" className="gap-2 h-11" onClick={() => navigate(PATHS.PARTNER_CREATE)}>
                <Plus className="h-4 w-4" />
                {t('create_partner')}
              </Button>
            </div>
          }
        />
      </div>

      {presenter.totalCount && presenter.totalCount > DEFAULT_PAGINATION_LIMIT ? (
        <NLTTablePagination limit={presenter.filters.limit} page={presenter.filters.page} totalRows={presenter.totalCount || 1} setPage={presenter.onChangePagination} />
      ) : null}

      <WarningModal
        title={t('delete_partner')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: presenter.deleteModal.name })}
        isOpen={presenter.deleteModal.isOpen}
        onClose={presenter.deleteModal.onClose}
        onSubmit={presenter.deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
