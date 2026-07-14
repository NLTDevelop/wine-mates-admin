import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { TabsContent, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs'
import { useTranslation } from 'react-i18next'
import { WineriesType, WINERY_STATUS } from '../../entities/types'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { useMemo } from 'react'
import { ConfirmModal } from '@/modals/confirmModal'
import { SearchInput } from '@/UIKit/shadcn/ui/input-search'
import { useWineriesList } from '../../presenters/useWinariesList'
import { useWineriesColumns } from '../../presenters/useWineriesColumns'
import { useNavigate } from 'react-router-dom'
import {  getWineryDetailPath } from '@/navigation/paths'

export const WineriesListView = () => {
  const { t } = useTranslation('winery')
  const navigate = useNavigate()

  const presenter = useWineriesList()
  const columns = useWineriesColumns({ onConfirm: presenter.confirmModal.confirm, onEdit: winery => navigate(`${getWineryDetailPath(winery.id)}?edit=true`) })
  const { table } = useDataTable(presenter.wineries ?? [], columns)

  const hasActiveFilters = useMemo(() => {
    return Object.values(presenter.columnFilters).some(value => value !== null && value !== undefined)
  }, [presenter.columnFilters])

  const modalActionTitle = presenter.wineryToConfirm.status === WINERY_STATUS.APPROVED ? t('cancel_action') : t('confirm_action')

  const modalMessage =
    presenter.wineryToConfirm.status === WINERY_STATUS.APPROVED
      ? t('cancel_actions', { slug: presenter.wineryToConfirm.wineryName })
      : t('confirm_actions', { slug: presenter.wineryToConfirm.wineryName })

  return (
    <ContentLayout title={t('wineries')}>
      <div className={cn('pb-2 w-full mx-auto', !presenter.isLoading ? 'fade-in' : '')}>
        <Tabs value={presenter.activeTab} onValueChange={value => presenter.handleTabChange(value as WineriesType)} className="w-full">
          <TabsList className="grid w-full md:w-auto sm:grid-cols-3 grid-cols-1  my-6">
            <TabsTrigger value="approved">{t('types.approved')}</TabsTrigger>
            <TabsTrigger value="rejected">{t('types.rejected')}</TabsTrigger>
            <TabsTrigger value="pending">{t('types.waiting')}</TabsTrigger>
          </TabsList>
          <TabsContent value={presenter.activeTab} className="space-y-6">
            <NLTDataTable
              table={table}
              rowClassname="text-center cursor-pointer"
              hasActiveFilters={hasActiveFilters}
              clearColumnFilters={presenter.clearColumnFilters}
              ToolBar={
                <div className="flex-1 items-center space-x-2">
                  <SearchInput value={presenter.searchValue} onChange={presenter.onChangeSearch} handleClear={presenter.handleClearSearch} placeholder={t('search_winery')} className="w-full" />
                </div>
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {presenter.totalCount && presenter.totalCount > DEFAULT_PAGINATION_LIMIT ? (
        <NLTTablePagination limit={presenter.filters.limit} page={presenter.filters.page} totalRows={presenter.totalCount || 1} setPage={presenter.onChangePagination} />
      ) : null}
      <ConfirmModal
        title={t('confirm_title')}
        actionTitle={modalActionTitle}
        variant="submit"
        isOpen={presenter.confirmModal.isOpen}
        onClose={presenter.confirmModal.close}
        onSubmit={presenter.wineryToConfirm.status !== WINERY_STATUS.APPROVED ? presenter.confirmModal.confirm : presenter.confirmModal.reject}
      >
        <div className="p-px">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
