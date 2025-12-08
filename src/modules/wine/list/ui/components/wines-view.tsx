import { useTranslation } from 'react-i18next'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'
import { WinesFilters } from '..'
import { useWineList } from '../../presenters/useWineList'
import { useWineColumns } from '../../presenters/useWineColumns'
import { WarningModal } from '@/modals/warningModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { File } from 'lucide-react'
import { ConfirmModal } from '@/modals/confirmModal'
import { ImportFileModal } from '@/modals/ImportFileModal'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { cn } from '@/lib/utils'
import { SkeletonWineList } from './skeleton-wine-list'
import { useEffect } from 'react'

export const WineView = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()

  const { wines, filters, onChangeSearch, handleClearSearch, onChangePagination, deleteModal, searchValue, deleteWine, wineToConfirm, confirmModal, importWines, isLoading, totalCount } = useWineList()
  const columns = useWineColumns({ onEdit: wine => navigate(`/wines/${wine.id}?edit=true`), onDelete: deleteWine, onConfirm: confirmModal.open })
  const { table } = useDataTable(wines ?? [], columns)

  const modalActionTitle = wineToConfirm.isConfirm ? t('list.cancel_action') : t('list.confirm_action')

  const modalMessage = wineToConfirm.isConfirm ? t('list.cancel_actions', { slug: wineToConfirm.wineName }) : t('list.confirm_actions', { slug: wineToConfirm.wineName })

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(PATHS.WINE_DETAIL.replace(':id', wineId))
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  if (isLoading) {
    return <SkeletonWineList />
  }
  return (
    <ContentLayout title={t('list.wines_list')}>
      <div className="text-end">
        <Button className="sm:w-auto w-full" onClick={importWines.openModal}>
          <File className="w-4 h-4 " />
          {t('button.import')}
        </Button>
      </div>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={<WinesFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
          onRowClick={handleRowClick}
        />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('list.wine_delete')}
        actionTitle={t('button.delete')}
        description={t('list.delete_description', { slug: `${deleteModal.wineName}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
      <ConfirmModal
        title={t('list.confirm_title')}
        actionTitle={modalActionTitle}
        variant="submit"
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onSubmit={!wineToConfirm.isConfirm ? confirmModal.confirm : confirmModal.reject}
      >
        <div className="p-[1px]">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
      <ImportFileModal
        isOpen={importWines.isOpen}
        onClose={importWines.closeModal}
        onImport={importWines.import}
        title={t('list.import_wines_list')}
        importButtonText={tc('button.import')}
        acceptedFileTypes={['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json']}
        maxSizeMB={10}
      />
    </ContentLayout>
  )
}
