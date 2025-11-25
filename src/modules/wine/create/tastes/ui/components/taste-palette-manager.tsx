import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTastePalette } from '../../presenters/useTastePalette'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { useReorderListTastes } from '../../../general/presenters/usePaletteReorder'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { cn, getDisplayNames } from '@/lib/utils'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { BaseWineColor } from '../../../general/entities/types'
import { WineTaste } from '../../entities/types/tastes'
import { WarningModal } from '@/modals/warningModal'
import { CreateTasteSection, TasteForm } from '..'

interface TastePaletteManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const TastePaletteManager = ({ cachedColors, colorsLoading = false }: TastePaletteManagerProps) => {
  const { t } = useTranslation('wines')

  const { reorder } = useReorderListTastes()

  const {
    tastes,
    loadings,
    isFormOpen,
    handleAddTaste,
    handleDeleteTaste,
    handleToggleForm,
    handleCancelEdit,
    formData,
    updateFormData,
    handleSaveTaste,
    totalCount,
    filters,
    onChangePagination,
    hasChanges,
  } = useTastePalette(cachedColors)

  const { deleteModal } = useDeleteModal()

  const handleOpenDeleteModal = useCallback(
    (groupId: string, groupNameUa: string) => {
      deleteModal.open(groupId, groupNameUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      handleDeleteTaste(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, handleDeleteTaste])

  const handleReorderWineTastes = (reorderedWineTastes: WineTaste[]) => {
    const items = reorderedWineTastes.map((wt, index) => ({
      id: wt.id,
      order: index,
    }))

    reorder({ entityType: 'tastes', items })
  }

  if (loadings.isLoadingData && tastes?.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
          <SkeletonWinePalette />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <CreateTasteSection onCreateTaste={handleAddTaste} isLoading={loadings.isCreating} cachedColors={cachedColors} />
        </div>
        {!loadings.isLoadingData && tastes?.length === 0 && totalCount === 0 && <EmptyState type="taste" />}
        <SortableList items={tastes} onReorder={handleReorderWineTastes}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {tastes?.map((taste, idx) => {
              const isEditing = isFormOpen[taste.id] || false
              const currentFormData = formData[taste.id]
              const { textColorClass } = useContrastText(taste.colorHex)
              const { nameUa, nameEn } = getDisplayNames(taste.translations)
              return (
                <SortableItem key={`${taste?.id} - ${idx}`} id={taste.id} gridColor={textColorClass} handleClassName="top-2 hover:bg-transparent">
                  <div className={cn('pl-8 border-1 border-input rounded-md transition-all cursor-default', isEditing && 'rounded-b-none')} style={{ backgroundColor: taste.colorHex }}>
                    <div className="p-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex gap-2 sm:flex-row flex-col sm:w-auto w-full">
                          <span className={cn('font-medium', textColorClass)}>
                            {nameUa} ({nameEn})
                          </span>
                          <div className="flex sm:gap-2 gap-1 sm:flex-row flex-col sm:w-auto w-full">
                            {taste.colors?.map((color, i) => (
                              <div key={`${color?.id} - ${i}`} className="bg-muted px-2 py-1 rounded text-xs">
                                {color?.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        <PaletteItemActions
                          isLoading={loadings.isLoading}
                          onRemove={handleConfirmDelete}
                          dataId={taste.id}
                          onEdit={() => handleToggleForm(taste.id)}
                          showEditButton={true}
                          isHeader
                          cardTextColorClass={textColorClass}
                          deleteModal={() => handleOpenDeleteModal(taste.id, nameUa)}
                        />
                      </div>

                      {isEditing && currentFormData && (
                        <TasteForm
                          formData={currentFormData}
                          onFormDataChange={(field, value) => updateFormData(taste.id, field, value)}
                          onSave={() => handleSaveTaste(taste.id)}
                          onCancel={() => handleCancelEdit(taste.id)}
                          cachedColors={cachedColors}
                          isLoading={loadings.isUpdating || colorsLoading}
                          mode="edit"
                          hasChanges={hasChanges(taste.id)}
                        />
                      )}
                    </div>
                  </div>
                </SortableItem>
              )
            })}
          </div>
        </SortableList>
        <WarningModal
          title={t('modal.delete_title', { slug: t('tastes.taste') })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('tastes.taste_note') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}
    </Card>
  )
}
