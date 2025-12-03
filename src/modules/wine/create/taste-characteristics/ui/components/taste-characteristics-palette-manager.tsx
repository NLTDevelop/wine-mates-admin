import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useCharacteristicPalette } from '../../presenters/useCharacteristicsPalette'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { useReorderListTasteCharacteristics } from '../../../general/presenters/usePaletteReorder'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { cn, getDisplayNameDescription } from '@/lib/utils'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { Button } from '@/UIKit/shadcn/ui/button'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { Save } from 'lucide-react'
import { BaseWineColor } from '../../../general/entities/types'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { WarningModal } from '@/modals/warningModal'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { CharacteristicLevelsDisplay, CharacteristicFormFields, CreateTasteCharacteristicSection } from '..'
import { WineTasteCharacteristics } from '../../entities/taste-characteristics'

interface TasteCharacteristicsPaletteManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const TasteCharacteristicsPaletteManager = ({ cachedColors, colorsLoading = false }: TasteCharacteristicsPaletteManagerProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { reorder } = useReorderListTasteCharacteristics()
  const { deleteModal } = useDeleteModal()

  const {
    tasteCharacteristics,
    isLoading,
    editingCharacteristicData,
    forceOpenKeys,
    setOpenAccordions,
    setEditingCharacteristic,
    setNewCharacteristicData,
    setEditingCharacteristicData,
    characteristics,
    ui,
  } = useCharacteristicPalette(cachedColors)

  const toggleCallbacks = { setOpenAccordions, setEditingCharacteristic, setNewCharacteristicData, setEditingCharacteristicData }

  const handleOpenDeleteModal = useCallback(
    (groupId: string, groupNameUa: string) => {
      deleteModal.open(groupId, groupNameUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      characteristics.handleDeleteCharacteristic(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, characteristics])

  const handleReorder = (reordered: WineTasteCharacteristics[]) => {
    const items = reordered.map((tc, index) => ({
      id: tc.id,
      order: index,
    }))

    reorder({ entityType: 'taste-characteristics', items })
  }

  if (isLoading && tasteCharacteristics?.length === 0) {
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
          <CreateTasteCharacteristicSection onCreateCharacteristic={characteristics.handleAddCharacteristic} isLoading={isLoading} cachedColors={cachedColors} />
        </div>
        {!isLoading && tasteCharacteristics?.length === 0 && <EmptyState type="taste-characteristics" />}
        <SortableList items={tasteCharacteristics} onReorder={handleReorder}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {tasteCharacteristics?.map((group: WineTasteCharacteristics, idx: number) => {
              const { textColorClass: cardTextColorClass } = useContrastText(group.colorHex)

              const isGroupOpen = ui?.isAccordionOpen(group.id)
              const isGroupEditing = ui?.isEditing(group.id)
              const isItemFormOpen = ui?.isFormItemOpen(group.id)
              const isGroupFormOpen = ui?.isFormGroupOpen(group.id)

              const currentEditingGroupData = editingCharacteristicData[group.id]
              const forceOpenKey = forceOpenKeys[group.id] || 0
              const accordionKey = isGroupOpen && forceOpenKey > 0 ? `forced-${group.id}-${forceOpenKey}` : `${group.id}-${idx}`
              const { nameUa, nameEn } = getDisplayNameDescription(group?.translations || [])

              return (
                <SortableItem key={accordionKey} id={group.id} className="flex flex-col" handleClassName="top-1.5 hover:bg-transparent" gridColor={cardTextColorClass}>
                  <AccordionWrapper
                    label={`${nameUa} (${nameEn})`}
                    isOpen={isGroupOpen}
                    onToggle={() => ui.handleToggleAccordion(group.id, toggleCallbacks)}
                    style={{ backgroundColor: group.colorHex, padding: '8px' }}
                    chevronStyle={cardTextColorClass}
                    header={
                      <div className="flex justify-between items-center w-full pl-8">
                        <div className="flex md:items-center items-start gap-2 md:flex-row flex-col flex-1">
                          <span className={cn('font-medium', cardTextColorClass)}>
                            {nameUa} ({nameEn})
                          </span>
                          {group?.colors.map((c: BaseWineColor, idx: number) => (
                            <div key={`${c?.id}-${idx}`} className="flex items-center bg-amber-50 px-2 rounded-md md:w-auto w-full">
                              <span className=" text-sm text-foreground">{c?.name}</span>
                            </div>
                          ))}
                        </div>
                        <PaletteItemActions
                          isLoading={isLoading}
                          onRemove={handleConfirmDelete}
                          dataId={group.id}
                          cardTextColorClass={cardTextColorClass}
                          onEdit={() => characteristics.startEditingCharacteristic(group.id)}
                          showEditButton={!isGroupEditing}
                          isHeader
                          deleteModal={() => handleOpenDeleteModal(group.id, nameUa)}
                        />
                      </div>
                    }
                  >
                    <div
                      className={cn(
                        'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-muted z-20',
                        isItemFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
                        'cursor-default'
                      )}
                    >
                      {isGroupOpen && !isGroupFormOpen && (
                        <div className="mt-4">
                          <CharacteristicLevelsDisplay levels={group.levels || []} group={group} colorBadge={{ backgroundColor: group.colorHex, color: cardTextColorClass }} />
                        </div>
                      )}

                      {isGroupFormOpen && currentEditingGroupData && (
                        <CharacteristicFormFields
                          formData={currentEditingGroupData}
                          onFormDataChange={(field, value) => characteristics.updateFormData(group.id, field, value)}
                          cachedColors={cachedColors}
                          isLoading={isLoading || colorsLoading}
                          autoFocus={true}
                        />
                      )}

                      <div className={cn('w-full flex gap-3 justify-end mt-3')}>
                        {isGroupFormOpen && (
                          <>
                            <Button size="sm" variant="ghost" className="border-1 hover:bg-muted-foreground hover:text-input" onClick={() => characteristics.handleCancelCharacteristicEdit(group.id)}>
                              {tc('button.cancel')}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => characteristics.handleSaveCharacteristic(group.id)}
                              disabled={!characteristics.canSave(group.id) || isLoading || !characteristics.hasChanges(group.id)}
                            >
                              <Save className="w-4 h-4" />
                              {isLoading ? tc('button.saving') : tc('button.save')}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </AccordionWrapper>
                </SortableItem>
              )
            })}
          </div>
        </SortableList>
        <WarningModal
          title={t('modal.delete_title', { slug: t('taste_characteristics.taste_characteristic') })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('taste_characteristics.characteristic') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
