import { useTranslation } from 'react-i18next'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'
import { useNavigate } from 'react-router-dom'
import { getWineDetailPath } from '@/navigation/paths'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useMemo } from 'react'
import { useWineList } from '../../../presenters/useWineList'
import { WinesFilters } from '../../../ui'
import { Table } from '@tanstack/react-table'

interface WineListProps {
  table: Table<unknown>
  renderActions?: () => React.ReactNode
  renderModals?: () => React.ReactNode
  isRowClickAvailable?: boolean
  isTitleAvailable?: boolean
}

export const WineList = ({ renderActions, renderModals, isRowClickAvailable = true, isTitleAvailable = true, table }: WineListProps) => {
  const { t } = useTranslation('wines')
  const navigate = useNavigate()

  const { filters, onChangeSearch, handleClearSearch, onChangePagination, searchValue, isLoading, totalCount, columnFilters, clearColumnFilters, sortBy } = useWineList()

  const hasActiveFilters = useMemo(() => {
    const hasColumnFilters = Object.values(columnFilters).some(value => value !== null && value !== undefined)
    return hasColumnFilters || !!sortBy
  }, [columnFilters, sortBy])

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(getWineDetailPath(wineId))
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  return (
    <ContentLayout title={isTitleAvailable ? t('list.wines_list') : undefined}>
      {renderActions?.()}
      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={
            <WinesFilters
              filterSearch={searchValue}
              onChangeFilterSearch={onChangeSearch}
              onClearSearch={handleClearSearch}
              hasActiveFilters={hasActiveFilters}
              clearColumnFilters={clearColumnFilters}
            />
          }
          onRowClick={isRowClickAvailable ? handleRowClick : undefined}
        />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 1} setPage={onChangePagination} /> : null}
      {renderModals?.()}
    </ContentLayout>
  )
}
