import { WarningModal } from '@/modals/warningModal'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useWineListColumns } from '../../../details/presenters/useWineListColumns'
import { useWineListOfWinery } from '../../presenters/useWineListOfWinery'
import { ContentLayout } from '@/layout/components/content-layout'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'

export const WineOfWinery = () => {
  const { t } = useTranslation('winery')

  const { wines, isLoading, totalCount, handleClearSearch, deleteModal, filters, onChangePagination, deleteWine } = useWineListOfWinery()

  const columns = useWineListColumns({ onDelete: deleteWine, showCheckbox: false, showDelete: true })
  const { table } = useDataTable(wines ?? [], columns)

  useEffect(() => {
    handleClearSearch()
  }, [])

  return (
    <ContentLayout>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable table={table} rowClassname="text-center "/>
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      <WarningModal
        title={t('modal.wine_delete')}
        actionTitle={t('button.delete')}
        description={t('modal.delete_description', { slug: `${deleteModal.wineName}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />
    </ContentLayout>
  )
}
