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
import { useEffect, useMemo } from 'react'
import { UnionWinesModal } from '@/modules/wine/list/ui/components/unionWinesModal'
import { IWines } from '../../entities/types/types'
import { useWineSelection } from '../../presenters/useWineSelection'
import { useCreateUnionWinesForm } from '../../presenters/useCreateUnionWinesForm'

export const WineView = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()

  const {
    wines,
    filters,
    onChangeSearch,
    handleClearSearch,
    onChangePagination,
    deleteModal,
    searchValue,
    deleteWine,
    wineToConfirm,
    confirmModal,
    importWines,
    isLoading,
    totalCount,
    columnFilters,
    clearColumnFilters,
    sortBy,
  } = useWineList()

  const { getSelectionInfo } = useWineSelection()

  const { form, onCreateOption, onSubmit, unionModal } = useCreateUnionWinesForm()

  const hasActiveFilters = useMemo(() => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value !== null && value !== undefined)
    return hasColumnFilters || !!sortBy
  }, [columnFilters, sortBy])

  const handleUnionClick = () => {
    if (table) {
      const selected = table.getSelectedRowModel().rows.map(row => row.original as IWines)

      const selectionInfo = getSelectionInfo(selected)
      unionModal.onOpen(selectionInfo)
    }
  }

  const columns = useWineColumns({ onEdit: wine => navigate(`/wines/${wine.id}?edit=true`), onDelete: deleteWine, onConfirm: confirmModal.open })
  const { table } = useDataTable(wines ?? [], columns)

  const modalActionTitle = wineToConfirm.isConfirm ? t('list.cancel_action') : t('list.confirm_action')

  const modalMessage = wineToConfirm.isConfirm ? t('list.cancel_actions', { slug: wineToConfirm.wineName }) : t('list.confirm_actions', { slug: wineToConfirm.wineName })

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(PATHS.WINE_DETAIL.replace(':id', wineId))
  }

  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    table?.resetRowSelection()
  }
  const unionModalClose = async () => {
    unionModal.onClose()
    table?.resetRowSelection()
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  return (
    <ContentLayout title={t('list.wines_list')}>
      <div className="flex justify-end items-center gap-2 mb-4 min-h-10">
        <Button onClick={importWines.openModal}>
          <File className="w-4 h-4 mr-2" />
          {t('button.import')}
        </Button>
      </div>
      {table?.getSelectedRowModel().rows.length > 1 && (
        <div className="fixed **top-[217px] left-84** bottom-1 right-8 z-50">
          <Button onClick={handleUnionClick} className="shadow-lg" size="xl">
            {t('list.union_btn')} ({table.getSelectedRowModel().rows.length})
          </Button>
        </div>
      )}
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          hasActiveFilters={hasActiveFilters}
          clearColumnFilters={clearColumnFilters}
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
        <div className="p-px">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
      <ImportFileModal
        isOpen={importWines.isOpen}
        onClose={importWines.closeModal}
        onImport={importWines.import}
        title={t('list.import_wines_list')}
        importButtonText={tc('button.import')}
        acceptedFileTypes={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
        maxSizeMB={10}
      />
      <UnionWinesModal isOpen={unionModal.isOpen} onClose={unionModalClose} form={form} onCreateOption={onCreateOption} onSubmit={handleSubmit} uniqueValues={unionModal.data?.uniqueValues} />
    </ContentLayout>
  )
}
