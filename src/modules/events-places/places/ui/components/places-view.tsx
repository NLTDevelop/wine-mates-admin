import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { ContentLayout } from '@/layout/components/content-layout'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { cn } from '@/lib/utils'
import { useWineList } from '@/modules/wine/list/presenters/useWineList'
import { usePlaceColumns } from '../../presenters/usePlaceColumns'
import { PlacesFilters } from './place-filters'
import { AddPlaceModal } from '@/modals/addPlaceModal'
import { WarningModal } from '@/modals/warningModal'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
export interface AddPlaceFormValues {
  name: string
  address: string
  timeWork: string
}

export const addPlaceSchema = z.object({
  name: z.string().min(1, ''),
  address: z.string().min(1, ''),
  timeWork: z.string().min(1, ''),
})
export const PlacesView = () => {
  const { t } = useTranslation('places')
  const navigate = useNavigate()
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false)

  const { wines, filters, onChangeSearch, handleClearSearch, onChangePagination, deleteModal, searchValue, deleteWine, wineToConfirm, confirmModal, isLoading, totalCount } = useWineList()
  const columns = usePlaceColumns({
    onEdit: wine => navigate(`/wines/${wine.id}?edit=true`),
    onDelete: deleteWine,
    onConfirm: confirmModal.open,
  })
  const { table } = useDataTable(wines ?? [], columns)

  const handleRowClick = (row: any) => {
    const wineId = row.original.id
    navigate(`/wines/${wineId}`)
  }

  useEffect(() => {
    handleClearSearch()
  }, [])

  const form = useForm<AddPlaceFormValues>({
    resolver: zodResolver(addPlaceSchema),
    defaultValues: {
      name: '',
      address: '',
      timeWork: '',
    },
  })

  return (
    <ContentLayout title={t('list')}>
      <div className="text-end mb-2">
        <Button onClick={() => setIsAddPlaceOpen(true)} className="sm:w-auto w-full">
          <Plus className="w-4 h-4 text-white mr-2" />
          {t('button.add_place')}
        </Button>
      </div>

      <div className={cn('pb-2', !isLoading ? 'fade-in' : '')}>
        <NLTDataTable
          table={table}
          rowClassname="text-center cursor-pointer"
          ToolBar={<PlacesFilters filterSearch={searchValue} onChangeFilterSearch={onChangeSearch} onClearSearch={handleClearSearch} />}
          onRowClick={handleRowClick}
        />
      </div>

      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount} setPage={onChangePagination} />}

      <WarningModal
        title={t('list.wine_delete')}
        actionTitle={t('button.delete')}
        description={t('delete_description', { slug: `${deleteModal.wineName}` })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onSubmit={deleteModal.onSubmit}
      />

      <AddPlaceModal isOpen={isAddPlaceOpen} onClose={() => setIsAddPlaceOpen(false)} form={form} />
    </ContentLayout>
  )
}
