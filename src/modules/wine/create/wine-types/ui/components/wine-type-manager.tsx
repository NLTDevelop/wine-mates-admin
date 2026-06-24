import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useWineTypePalette } from '../../presenters/useWineTypePalette'
import { cn, getDisplayNames } from '@/lib/utils'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { WarningModal } from '@/modals/warningModal'
import { CreateWineTypeSection, WineTypeForm } from '..'
import { useWineTypeStore } from '../../entities/wine-type-store'
import { WineType } from '../../entities/types/wine-type'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'

export const WineTypeManager = () => {
  const { t } = useTranslation('wines')

  const { deleteModal } = useDeleteModal()

  const store = useWineTypeStore()

  const wineTypes = store.wineTypes

  const {
    isLoading,
    isFormOpen,
    handleAddWineType,
    handleDeleteWineType,
    handleToggleForm,
    handleCancelEdit,
    formData,
    updateFormData,
    handleSaveWineType,
    hasChanges,
    isReorderingGroup,
    reorderGroup,
  } = useWineTypePalette()

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

  const onReorder = useCallback(
    (reorderedGroups: WineType[]) => {
      store.reorderType(
        reorderedGroups.map((group, index) => ({
          id: Number(group.id),
          sortNumber: index,
        }))
      )
      const reorderParams = reorderedGroups.map((group, index) => ({
        id: Number(group.id),
        sortNumber: index,
      }))

      reorderGroup(reorderParams)
    },
    [reorderGroup, store]
  )

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
      <CardContent className={cn('space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0', !isLoading ? 'fade-in' : '')}>
        <div>
          <CreateWineTypeSection onCreateWineType={handleAddWineType} isLoading={isLoading || isReorderingGroup} />
        </div>

        {!isLoading && wineTypes?.length === 0 && <EmptyState type="wine-types" />}

        <SortableList items={wineTypes} onReorder={onReorder}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {wineTypes?.map((wineType, idx) => {
              const isEditing = isFormOpen[wineType.id] || false
              const currentFormData = formData[wineType.id]
              const { nameUa, nameEn } = getDisplayNames(wineType.translations)
              return (
                <SortableItem id={wineType.id} key={`${wineType.id}-${idx}`} handleClassName="top-2 hover:bg-transparent" disabled={isReorderingGroup}>
                  <div
                    key={`${wineType.id}-${idx}`}
                    className={cn(
                      'border border-input rounded-md transition-all cursor-default',
                      isEditing && 'rounded-md bg-card text-card-foreground shadow-sm card-spacing box-border border-border transition-colors border-dashed p-0'
                    )}
                  >
                    <div className={cn(!isEditing && 'p-2')}>
                      {!isEditing ? (
                        <div className="flex justify-between items-center w-full pl-8 min-w-0 flex-1">
                          <div className="flex gap-2 sm:flex-row flex-col sm:w-auto w-full min-w-0 flex-1">
                            <span className="font-medium truncate flex-1">
                              {nameUa} ({nameEn})
                            </span>
                          </div>
                          <PaletteItemActions
                            isLoading={isLoading || isReorderingGroup}
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
                            isLoading={isLoading}
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
          title={t('modal.delete_title', { slug: t('types.wine_type').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('types.wine_type') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
