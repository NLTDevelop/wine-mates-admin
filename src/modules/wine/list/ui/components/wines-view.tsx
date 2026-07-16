import { useTranslation } from 'react-i18next'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { useNavigate } from 'react-router-dom'
import { getWineDetailPath } from '@/navigation/paths'
import { useWineList } from '../../presenters/useWineList'
import { useWineColumns } from '../../presenters/useWineColumns'
import { WarningModal } from '@/modals/warningModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { File } from 'lucide-react'
import { ConfirmModal } from '@/modals/confirmModal'
import { ImportFileModal } from '@/modals/ImportFileModal'
import { useEffect } from 'react'
import { UnionWinesModal } from '@/modules/wine/list/ui/components/unionWinesModal'
import { IWines } from '../../entities/types/types'
import { useWineSelection } from '../../presenters/useWineSelection'
import { useCreateUnionWinesForm } from '../../presenters/useCreateUnionWinesForm'
import { WineList } from '../../shared/ui'

export const WineView = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()

  const wineList = useWineList()

  const { wines, deleteModal, deleteWine, handleClearSearch, wineToConfirm, confirmModal, importWines } = wineList

  const { getSelectionInfo } = useWineSelection()

  const { form, onCreateOption, onSubmit, unionModal } = useCreateUnionWinesForm()

  const handleUnionClick = () => {
    if (table) {
      const selected = table.getSelectedRowModel().rows.map(row => row.original as IWines)

      const selectionInfo = getSelectionInfo(selected)
      unionModal.onOpen(selectionInfo)
    }
  }

  const columns = useWineColumns({ onEdit: wine => navigate(`${getWineDetailPath(wine.id)}?edit=true`), onDelete: deleteWine, onConfirm: confirmModal.open })
  const { table } = useDataTable(wines ?? [], columns)

  const modalActionTitle = wineToConfirm.isConfirm ? t('list.cancel_action') : t('list.confirm_action')

  const modalMessage = wineToConfirm.isConfirm ? t('list.cancel_actions', { slug: wineToConfirm.wineName }) : t('list.confirm_actions', { slug: wineToConfirm.wineName })

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
    <WineList
      table={table}
      isRowClickAvailable
      renderActions={() => (
        <>
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
        </>
      )}
      renderModals={() => (
        <>
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
        </>
      )}
    />
  )
}
