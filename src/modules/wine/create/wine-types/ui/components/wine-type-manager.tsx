import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { useWineTypePalette } from '../../presenters/useWineTypePalette'
import { CreateWineTypeSection, WineTypeForm } from '..'
import { BaseWineColor } from '../../../general/entities/types'
import { cn, getDisplayNames } from '@/lib/utils'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useCallback } from 'react'
import { WarningModal } from '@/modals/warningModal'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../../general/ui/components/empty-state'

interface WineTypeManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const WineTypeManager = ({ cachedColors, colorsLoading = false }: WineTypeManagerProps) => {
  const { t } = useTranslation('wines')
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

        {!isLoading && wineTypes?.length === 0 && <EmptyState type="taste" />}
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {wineTypes?.map(wineType => {
            const isEditing = isFormOpen[wineType.id] || false
            const currentFormData = formData[wineType.id]
             const { nameUa, nameEn } = getDisplayNames(wineType.translations)
            return (
              <div
                key={wineType.id}
                className={cn(
                  'border-1 border-input rounded-md transition-all cursor-default',
                  isEditing && 'rounded-md bg-card text-card-foreground shadow-sm card-spacing box-border border-border transition-colors border-dashed p-0'
                )}
              >
                <div className={cn(!isEditing && 'p-2')}>
                  {!isEditing ? (
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {/* {wineType.nameUa} ({wineType.nameEn}) */}
                          {nameUa} ({nameEn})
                        </span>
                        {wineType.colors?.map((color: BaseWineColor, idx: number) => (
                          <div key={color?.id+idx} className="bg-muted px-2 py-1 rounded text-xs">
                            {nameUa}
                            {/* {color.nameUa} */}
                          </div>
                        ))}
                      </div>
                      <PaletteItemActions
                        isLoading={isLoading}
                        onRemove={handleConfirmDelete}
                        dataId={wineType.id}
                        onEdit={() => handleToggleForm(wineType.id)}
                        showEditButton={true}
                        isHeader
                        deleteModal={() => handleOpenDeleteModal(wineType.id, /*wineType.*/nameUa)}
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
            )
          })}
        </div>
        <WarningModal
          title={t('modal.delete_title', { slug: 'тип вина' })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: 'Тип вина' })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
