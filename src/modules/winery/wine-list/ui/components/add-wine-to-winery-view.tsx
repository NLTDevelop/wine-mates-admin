import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { useWineListEmptyWinery } from '../../presenters/useWineListEmptyWinery'
import { useWineColumns } from '@/modules/wine/list/presenters/useWineColumns'
import { cn } from '@/lib/utils'
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WinesFilters } from '@/modules/wine/list/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { getWineDetailPath, getWineryDetailPath } from '@/navigation/paths'
import { useAddWinesStore } from '../../entities/wine-list-store'
import { IWines } from '@/modules/wine/list/entities/types/types'
import { AddedWines } from './added-wines'
import { RowSelectionState } from '@tanstack/react-table'

export const AddWineToWineryView = () => {
  const { t } = useTranslation('winery')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { setSelectedWines } = useAddWinesStore()
  const { selectedWines } = useAddWinesStore()

  const { winesEmptyWinery, handleClearSearch, handleColumnFilter, emptyWineryFilters, clearColumnFilters, isLoading, searchValue, onChangeSearch, columnFilters, totalCount, onChangePagination } =
    useWineListEmptyWinery()

  const filterParams = { handleColumnFilter, filters: emptyWineryFilters }

  const columns = useWineColumns({ isSortAvailable: false, filterParams })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    const initialSelection: RowSelectionState = {}
    if (selectedWines?.length) {
      winesEmptyWinery?.forEach((wine, index) => {
        if (selectedWines.some(selected => selected.id === wine.id)) {
          initialSelection[index] = true
        }
      })
    }
    return initialSelection
  })

  useEffect(() => {
    if (selectedWines?.length && winesEmptyWinery?.length) {
      const newSelection: RowSelectionState = {}
      winesEmptyWinery.forEach((wine, index) => {
        if (selectedWines.some(selected => selected.id === wine.id)) {
          newSelection[index] = true
        }
      })
      setRowSelection(newSelection)
    } else {
      setRowSelection({})
    }
  }, [winesEmptyWinery, selectedWines])

  const { table } = useDataTable(winesEmptyWinery ?? [], columns, {
    rowSelection,
    onRowSelectionChange: updater => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newSelection)
      const selectedIndexes = Object.keys(newSelection).filter(key => newSelection[key])
      const selectedWineData = selectedIndexes.map(index => winesEmptyWinery?.[parseInt(index)]).filter(Boolean) as IWines[]
      const currentPageIds = new Set(winesEmptyWinery?.map(w => w.id))
      const existingSelected = selectedWines?.filter(w => !currentPageIds.has(w.id)) || []
      const allSelected = [...existingSelected, ...selectedWineData]
      setSelectedWines(allSelected)
    },
  })

 
  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(getWineDetailPath(wineId))
  }

  const hasActiveFilters = useMemo(() => {
    return Object.values(columnFilters).some(value => value !== null && value !== undefined)
  }, [columnFilters])



  return (
    <ContentLayout title={t('add_wines_to_winery')} isGoBack handleGoBack={() => navigate(getWineryDetailPath(id))}>
      <AddedWines/>
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

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT ? (
        <NLTTablePagination limit={emptyWineryFilters.limit} page={emptyWineryFilters.page} totalRows={totalCount || 1} setPage={onChangePagination} />
      ) : null}
    </ContentLayout>
  )
}
