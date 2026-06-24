import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAnalyzedWineList } from '../../presenters/useAnalyzedWineList'
import { useAnalyzedWineColumns } from '../../presenters/useAnalyzedWineColumns'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { PATHS } from '@/navigation/paths'
import { AnalyzedWineFilters } from './analyzed-wine-filters'

export const AnalysisView = () => {
  const { t } = useTranslation('analysis')
  const navigate = useNavigate()

  const { analyzedWines, filters, onChangeSearch, handleClearSearch, onChangePagination, searchValue, isLoading, totalCount } = useAnalyzedWineList()
  const columns = useAnalyzedWineColumns()
  const { table } = useDataTable(analyzedWines ?? [], columns)

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(PATHS.ANALYSIS_DETAIL.replace(':id', wineId))
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  return (
    <ContentLayout title={t('wines_list')}>
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={<AnalyzedWineFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
          onRowClick={handleRowClick}
        />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
    </ContentLayout>
  )
}
