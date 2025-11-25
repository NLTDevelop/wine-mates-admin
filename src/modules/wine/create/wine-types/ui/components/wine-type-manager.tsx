import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useReorderListWineTypes } from '../../../general/presenters/usePaletteReorder'
import { useWineTypePalette } from '../../presenters/useWineTypePalette'
import { cn, getDisplayNames } from '@/lib/utils'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { BaseWineColor } from '../../../general/entities/types'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { WarningModal } from '@/modals/warningModal'
import { CreateWineTypeSection, WineTypeForm } from '..'
import { WineType } from '../../entities/types/wine-type'

interface WineTypeManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const WineTypeManager = ({ cachedColors, colorsLoading = false }: WineTypeManagerProps) => {
  const { t } = useTranslation('wines')

  const { reorder } = useReorderListWineTypes()

  const { deleteModal } = useDeleteModal()

  const { wineTypes, isLoading, isFormOpen, handleAddWineType, handleDeleteWineType, handleToggleForm, handleCancelEdit, formData, updateFormData, handleSaveWineType, hasChanges } =
    useWineTypePalette(cachedColors)

  const handleOpenDeleteModal = useCallback(
    (groupId: string, groupNameUa: string) => {
      deleteModal.open(groupId, groupNameUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      handleDeleteWineType(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, handleDeleteWineType])

  const handleReorderWineTypes = (reorderedWineType: WineType[]) => {
    const items = reorderedWineType.map((wt, index) => ({
      id: wt.id,
      order: index,
    }))

    reorder({ entityType: 'wine-types', items })
  }

  if (isLoading && wineTypes.length === 0) {
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
          <CreateWineTypeSection onCreateWineType={handleAddWineType} isLoading={isLoading} cachedColors={cachedColors} />
        </div>

        {!isLoading && wineTypes?.length === 0 && <EmptyState type="wine-types" />}

        <SortableList items={wineTypes} onReorder={handleReorderWineTypes}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {wineTypes?.map((wineType, idx) => {
              const isEditing = isFormOpen[wineType.id] || false
              const currentFormData = formData[wineType.id]
              const { nameUa, nameEn } = getDisplayNames(wineType.translations)

              return (
                <SortableItem id={wineType.id} key={`${wineType.id}-${idx}`} handleClassName="top-2 hover:bg-transparent">
                  <div
                    key={`${wineType.id}-${idx}`}
                    className={cn(
                      'border-1 border-input rounded-md transition-all cursor-default',
                      isEditing && 'rounded-md bg-card text-card-foreground shadow-sm card-spacing box-border border-border transition-colors border-dashed p-0'
                    )}
                  >
                    <div className={cn(!isEditing && 'p-2')}>
                      {!isEditing ? (
                        <div className="flex justify-between items-center w-full pl-8">
                          <div className="flex gap-2 sm:flex-row flex-col sm:w-auto w-full">
                            <span className="font-medium">
                              {nameUa} ({nameEn})
                            </span>
                            <div className="flex sm:gap-2 gap-1 sm:flex-row flex-col sm:w-auto w-full">
                              {wineType?.colors?.map((color: BaseWineColor, idx: number) => {
                                const colorName = color?.name || getDisplayNames(color?.translations || []).nameUa
                                return (
                                  <div key={color?.id + idx} className="bg-muted px-2 py-1 rounded text-xs">
                                    {colorName}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <PaletteItemActions
                            isLoading={isLoading}
                            onRemove={handleConfirmDelete}
                            dataId={wineType.id}
                            onEdit={() => handleToggleForm(wineType.id)}
                            showEditButton={true}
                            isHeader
                            deleteModal={() => handleOpenDeleteModal(wineType.id, nameUa)}
                          />
                        </div>
                      ) : (
                        currentFormData && (
                          <WineTypeForm
                            formData={currentFormData}
                            onFormDataChange={(field, value) => updateFormData(wineType.id, field, value)}
                            onSave={() => handleSaveWineType(wineType.id)}
                            onCancel={() => handleCancelEdit(wineType.id)}
                            cachedColors={cachedColors}
                            isLoading={isLoading || colorsLoading}
                            mode="edit"
                            hasChanges={hasChanges(wineType.id)}
                          />
                        )
                      )}
                    </div>
                  </div>
                </SortableItem>
              )
            })}
          </div>
        </SortableList>
        <WarningModal
          title={t('modal.delete_title', { slug: t('types:wine_type').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('types:wine_type') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
