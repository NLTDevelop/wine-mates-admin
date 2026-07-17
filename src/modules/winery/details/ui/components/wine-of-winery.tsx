import { WarningModal } from '@/modals/warningModal'
import { WineList } from '@/modules/wine/list/shared/ui'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useWineListOfWinery } from '../../presenters/useWineListOfWinery'
import { PATHS } from '@/navigation/paths'
import { useNavigate } from 'react-router-dom'
import { useWineListColumns } from '../../presenters/useWineListColumns'

export const WineOfWinery = () => {
  const { t } = useTranslation('winery')
  const navigate = useNavigate()

  const { wines, handleClearSearch, deleteModal } = useWineListOfWinery()
  console.log('->', wines)

  const columns = useWineListColumns({ onDelete: () => console.log('delete'), showCheckbox: false, showDelete: true })
  const { table } = useDataTable(wines ?? [], columns)

  useEffect(() => {
    handleClearSearch()
  }, [handleClearSearch])

  return (
    <WineList
      table={table}
      isRowClickAvailable={false}
      isTitleAvailable={false}
      isClearFilterBtnAvailable={false}
      renderActions={() => (
        <div className={cn('flex justify-end items-center gap-2 min-h-10')}>
          <Button onClick={() => navigate(PATHS.WINERY_ADD_WINE)}>{t('button.add_wine')}</Button>
        </div>
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
        </>
      )}
    />
  )
}
