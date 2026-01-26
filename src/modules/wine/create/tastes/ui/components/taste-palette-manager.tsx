import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn, createTranslations, getDisplayNames, lightenColor } from '@/lib/utils'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { Save } from 'lucide-react'
import { WarningModal } from '@/modals/warningModal'
import { useWineTasteStore } from '../../entities/wine-taste-store'
import { useTastePalette } from '../../presenters/useTastePalette'
import { WineTasteGroup } from '../../entities/types/tastes'
import { CreateTasteGroupSection } from './create-taste-group-section'
import { TasteGroupFormFields } from './taste-group-form-field'
import { TasteList } from './taste-list'
import { TasteForm } from './taste-form'

export const TastePaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const store = useWineTasteStore()

  const tasteGroups = store.tasteGroups

  const { deleteModal } = useDeleteModal()

  const {
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
    isReorderingGroup,
    reorderGroup,
  } = useTastePalette()

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

  const onReorder = useCallback(
    (reorderedGroups: WineTasteGroup[]) => {
      store.reorderTasteGroups(
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

  const isReordering = isReorderingGroup

  if (isLoading && tasteGroups?.length === 0) {
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
          <CreateTasteGroupSection onCreateGroup={groups.handleAddGroup} isLoading={isLoading || isReordering} />
        </div>
        {!isLoading && tasteGroups?.length === 0 && <EmptyState type="taste" />}
        <SortableList items={tasteGroups} onReorder={onReorder}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {tasteGroups?.map((group: WineTasteGroup) => {
              const { textColorClass: cardTextColorClass } = useContrastText(group.colorHex)

              const isGroupOpen = ui.isAccordionOpen(group.id)
              const isGroupEditing = ui.isEditing(group.id)
              const isItemFormOpen = ui.isFormItemOpen(group.id)
              const isGroupFormOpen = ui.isFormGroupOpen(group.id)

              const currentEditingGroupData = editingGroupData[group.id]
              const forceOpenKey = forceOpenKeys[group.id] || 0
              const accordionKey = isGroupOpen && forceOpenKey > 0 ? `forced-${group.id}-${forceOpenKey}` : group.id
              const { nameUa, nameEn } = getDisplayNames(group.translations)

              return (
                <SortableItem key={accordionKey} id={group.id} className="flex flex-col" handleClassName="top-1.5 hover:bg-transparent" gridColor={cardTextColorClass} disabled={isReordering}>
                  <AccordionWrapper
                    label={`${nameUa} (${nameEn})`}
                    isOpen={isGroupOpen}
                    onToggle={() => ui.handleToggleAccordion(group.id, toggleCallbacks)}
                    style={{ backgroundColor: group.colorHex, padding: '8px' }}
                    chevronStyle={cardTextColorClass}
                    header={
                      <div className="flex justify-between items-center w-full pl-8 flex-1 min-w-0">
                        <div className="flex md:items-center items-start gap-2 md:flex-row flex-col flex-1 min-w-0">
                          <span className={cn('font-medium truncate min-w-0 flex-1 text-start', cardTextColorClass)}>
                            {nameUa} ({nameEn})
                          </span>
                        </div>
                        <PaletteItemActions
                          isLoading={isLoading || isReordering}
                          onRemove={handleConfirmDelete}
                          dataId={group.id}
                          cardTextColorClass={cardTextColorClass}
                          onEdit={() => groups.startEditingGroup(group.id)}
                          showEditButton={!isGroupEditing && !isReordering}
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
                      {isGroupFormOpen && currentEditingGroupData && (
                        <TasteGroupFormFields formData={currentEditingGroupData} onFormDataChange={(field, value) => groups.updateGroupFormData(group.id, field, value)} autoFocus={true} />
                      )}

                      {isGroupOpen && !isGroupFormOpen && (
                        <>
                          <TasteList
                            items={items.getTasteForGroup(group.id)}
                            isLoading={isLoading}
                            onRemove={id => items.onRemoveItem(group.id, id)}
                            onEdit={item => items.handleEditItem(group.id, item)}
                            getItemName={items.getItemName}
                            cardTextColorClass={cardTextColorClass}
                            isEditable={isEditable}
                            showEditButton={isEditable}
                            hexColor={`${lightenColor(group.colorHex, 40)}`}
                            onReorder={reorderedTaste => items.handleReorderTaste(group.id, reorderedTaste)}
                          />

                          {isItemFormOpen && group?.flavors && group?.flavors.length > 0 && <Separator className="mt-2" style={{ backgroundColor: group.colorHex }} />}
                        </>
                      )}

                      {isItemFormOpen && (
                        <>
                          <TasteForm
                            data={{
                              translations: newItemData[group.id]?.translations || createTranslations('', ''),
                              colorHex: newItemData[group.id].colorHex || '',
                            }}
                            onDataChange={(field, value) => {
                              items.updateItemFormData(group.id, field as 'name' | 'nameEn', value)
                            }}
                            nameLabel={t('tastes.taste_name_ua')}
                            nameEnLabel={t('tastes.taste_name_en')}
                            namePlaceholder={t('tastes.taste_name_ua')}
                            nameEnPlaceholder={t('tastes.taste_name_en')}
                            autoFocus={!editingGroup?.editingItem}
                          />
                        </>
                      )}

                      <div className={cn('w-full flex gap-3 justify-end mt-3')}>
                        {!isGroupFormOpen && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border-1 hover:bg-muted-foreground hover:text-input"
                            onClick={() => (isItemFormOpen ? items.handleCancelItemEdit(group.id) : items.handleAddAromaClick(group.id))}
                          >
                            {isItemFormOpen ? t('button.cancel') : t('button.create_new_taste')}
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
                            disabled={!items.canAddItem(group.id) || isLoading || !items.hasChanges(group.id)}
                            size="sm"
                          >
                            <Save className="w-4 h-4" />
                            {isLoading ? tc('button.saving') : tc('button.save')}
                          </Button>
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
          title={t('modal.delete_title', { slug: t('tastes.taste_group').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('tastes.taste_group') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  )
}
