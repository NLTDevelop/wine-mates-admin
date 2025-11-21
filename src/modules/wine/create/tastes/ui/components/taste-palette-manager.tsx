import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'

import { BaseWineColor } from '../../../general/entities/types'
import { useTastePalette } from '../../presenters/useTastePalette'
import { CreateTasteSection } from './create-taste-section'
import { TasteForm } from './taste-form'
import { cn, getDisplayNames } from '@/lib/utils'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { WarningModal } from '@/modals/warningModal'

interface TastePaletteManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const TastePaletteManager = ({ cachedColors, colorsLoading = false }: TastePaletteManagerProps) => {
  const { t } = useTranslation('wines')
  const {
    tastes,
    isLoading,
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

  if (isLoading && tastes?.length === 0) {
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
          <CreateTasteSection onCreateTaste={handleAddTaste} isLoading={isLoading} cachedColors={cachedColors} />
        </div>
        {!isLoading && tastes?.length === 0 && totalCount === 0 && <EmptyState type="taste" />}
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {tastes?.map((taste, idx) => {
            const isEditing = isFormOpen[taste.id] || false
            const currentFormData = formData[taste.id]
            const { textColorClass } = useContrastText(taste.colorHex)
            const { nameUa, nameEn } = getDisplayNames(taste.translations)
            return (
              <div key={`${taste?.id} - ${idx}`} className={cn('border-1 border-input rounded-md transition-all cursor-default', isEditing && 'rounded-b-none')} style={{ backgroundColor: taste.colorHex }}>
                <div className="p-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2 sm:flex-row flex-col sm:w-auto w-full">
                      <span className={cn('font-medium', textColorClass)}>
                        {nameUa} ({nameEn}){/* {taste.nameUa} ({taste.nameEn}) */}
                      </span>
                      <div className="flex sm:gap-2 gap-1 sm:flex-row flex-col sm:w-auto w-full">
                        {taste.colors?.map((color, i) => (
                          <div key={`${color?.id} - ${i}`} className="bg-muted px-2 py-1 rounded text-xs">
                            {nameUa}
                            {/* {color.nameUa} */}
                          </div>
                        ))}
                      </div>
                    </div>
                    <PaletteItemActions
                      isLoading={isLoading}
                      onRemove={handleConfirmDelete}
                      dataId={taste.id}
                      onEdit={() => handleToggleForm(taste.id)}
                      showEditButton={true}
                      isHeader
                      cardTextColorClass={textColorClass}
                      deleteModal={() => handleOpenDeleteModal(taste.id, /*taste.*/ nameUa)}
                    />
                  </div>

                  {isEditing && currentFormData && (
                    <TasteForm
                      formData={currentFormData}
                      onFormDataChange={(field, value) => updateFormData(taste.id, field, value)}
                      onSave={() => handleSaveTaste(taste.id)}
                      onCancel={() => handleCancelEdit(taste.id)}
                      cachedColors={cachedColors}
                      isLoading={isLoading || colorsLoading}
                      mode="edit"
                      hasChanges={hasChanges(taste.id)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <WarningModal
          title={t('modal.delete_title', { slug: 'смакову ноту' })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: 'Смакова нота' })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}
    </Card>
  )
}
