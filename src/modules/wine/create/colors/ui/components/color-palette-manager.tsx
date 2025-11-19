import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { CreateColorGroupSection } from './create-color-group-section'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { ShadesList } from './shades-list'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, lightenColor } from '@/lib/utils'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { CreateShadesParams, WineColorGroup } from '../../entities/types/color-types'
import { useColorPalette } from '../../presenters/useColorPalette'
import { ColorGroupFormFields } from './color-group-form-fields'
import { ColorForm } from './color-form'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useCallback } from 'react'
import { WarningModal } from '@/modals/warningModal'

export const ColorPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { deleteModal } = useDeleteModal()

  const {
    colorGroups,
    isLoading,
    editingGroup,
    newItemData,
    editingGroupData,
    forceOpenKeys,
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
    groups,
    items,
    ui,
    totalCount,
    filters,
    onChangePagination,
  } = useColorPalette()

  const isEditable = true

  const toggleCallbacks = { setOpenAccordions, setEditingGroup, setNewItemData, setEditingGroupData }

  const handleOpenDeleteModal = useCallback(
    (groupId: string, groupNameUa: string) => {
      deleteModal.open(groupId, groupNameUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      groups.handleDeleteGroup(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, groups])

  if (isLoading && colorGroups.length === 0) {
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
          <CreateColorGroupSection onCreateGroup={groups.handleAddGroup} isLoading={isLoading} />
        </div>
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {colorGroups?.map((group: WineColorGroup) => {
            const { textColorClass: cardTextColorClass } = useContrastText(group.colorHex)
            const isGroupOpen = ui.isAccordionOpen(group.id)
            const isGroupEditing = ui.isEditing(group.id)
            const isItemFormOpen = ui.isFormItemOpen(group.id)
            const isGroupFormOpen = ui.isFormGroupOpen(group.id)

            const itemsList = group.shades || []

            const currentEditingGroupData = editingGroupData[group.id]
            const forceOpenKey = forceOpenKeys[group.id] || 0
            const accordionKey = isGroupOpen && forceOpenKey > 0 ? `forced-${group.id}-${forceOpenKey}` : group.id

            return (
              <div key={accordionKey} className="flex flex-col">
                <AccordionWrapper
                  label={`${group.nameUa} (${group.nameEn})`}
                  isOpen={isGroupOpen}
                  onToggle={() => ui.handleToggleAccordion(group.id, toggleCallbacks)}
                  style={{ backgroundColor: group.colorHex, padding: '8px' }}
                  chevronStyle={cardTextColorClass}
                  header={
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-medium', cardTextColorClass)}>
                          {group.nameUa} ({group.nameEn})
                        </span>
                      </div>
                      <PaletteItemActions
                        isLoading={isLoading}
                        onRemove={handleConfirmDelete}
                        dataId={group.id}
                        cardTextColorClass={cardTextColorClass}
                        onEdit={() => groups.startEditingGroup(group.id)}
                        showEditButton={!isGroupEditing}
                        isHeader
                        deleteModal={() => handleOpenDeleteModal(group.id, group.nameUa)}
                      />
                    </div>
                  }
                >
                  <div
                    className={cn(
                      'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-muted',
                      isItemFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
                      'cursor-default',
                      'group',
                      itemsList.length > 0 ? 'gap-2 items-start' : 'gap-4'
                    )}
                  >
                    {isGroupFormOpen && currentEditingGroupData && (
                      <ColorGroupFormFields
                        formData={currentEditingGroupData}
                        onFormDataChange={(field, value) => groups.updateGroupFormData(group.id, field, value)}
                        isLoading={isLoading}
                        autoFocus={true}
                      />
                    )}

                    {isGroupOpen && !isGroupFormOpen && (
                      <>
                        <ShadesList
                          items={items.getShadesForGroup(group.id, group.shades)}
                          isLoading={isLoading}
                          onRemove={shadeId => items.onRemoveItem(group.id, shadeId)}
                          onEdit={shade => items.handleEditItem(group.id, shade)}
                          getItemName={items.getItemName}
                          cardTextColorClass={cardTextColorClass}
                          isEditable={isEditable}
                          showEditButton={isEditable}
                          hexColor={`${lightenColor(group.colorHex, 40)}`}
                          onReorder={reorderedShades => items.handleReorderShades(group.id, reorderedShades)}
                        />

                        {isItemFormOpen && group?.shades?.length > 0 && <Separator className="mt-2" style={{ backgroundColor: group.colorHex }} />}
                      </>
                    )}

                    {isItemFormOpen && (
                      <>
                        <ColorForm
                          data={{
                            nameUa: newItemData[group.id]?.nameUa || '',
                            nameEn: newItemData[group.id]?.nameEn || '',
                            tonePale: newItemData[group.id]?.tonePale || '',
                            toneMedium: newItemData[group.id]?.toneMedium || '',
                            toneDeep: newItemData[group.id]?.toneDeep || '',
                            colorHex: newItemData[group.id]?.colorHex || '',
                          }}
                          onDataChange={(field, value) => {
                            items.updateItemFormData(group.id, field as keyof CreateShadesParams, value)
                          }}
                          autoFocus={!editingGroup?.editingItem}
                          baseColor={group.colorHex || ''}
                        />
                      </>
                    )}

                    <div className={cn('w-full flex gap-3 justify-end mt-3')}>
                      {!isGroupFormOpen && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="border-1 hover:bg-muted-foreground hover:text-input"
                          onClick={() => (isItemFormOpen ? items.handleCancelItemEdit(group.id) : items.handleAddShadeClick(group.id))}
                        >
                          {isItemFormOpen ? t('button.cancel') : t('button.add_new_shade')}
                        </Button>
                      )}

                      {isGroupFormOpen && (
                        <>
                          <Button size="sm" variant="ghost" className="border-1 hover:bg-muted-foreground hover:text-input" onClick={() => groups.handleCancelGroupEdit(group.id)}>
                            {tc('button.cancel')}
                          </Button>
                          <Button size="sm" onClick={() => groups.handleSaveGroup(group.id)} disabled={!groups.canSaveGroup(group.id) || isLoading || !groups.hasChanges(group.id)}>
                            <Save className="w-4 h-4" />
                            {isLoading ? tc('button.saving') : tc('button.save')}
                          </Button>
                        </>
                      )}

                      {isItemFormOpen && !isGroupFormOpen && (
                        <Button
                          onClick={() => {
                            items.handleSaveItem(group.id)
                          }}
                          disabled={!items.canAddItem(group.id) || isLoading}
                          size="sm"
                        >
                          <Save className="w-4 h-4" />
                          {isLoading ? tc('button.saving') : tc('button.save')}
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionWrapper>
              </div>
            )
          })}
        </div>
        <WarningModal
          title={t('modal.delete_title', { slug: 'колір' })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: 'Колір' })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}
    </Card>
  )
}
