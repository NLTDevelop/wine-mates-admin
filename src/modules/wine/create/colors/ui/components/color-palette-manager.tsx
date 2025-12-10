import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useColorPalette } from '../../presenters/useColorPalette'
import { cn, createTranslations, getDisplayNames } from '@/lib/utils'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { WarningModal } from '@/modals/warningModal'
import { Save } from 'lucide-react'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { CreateShadesParams, WineColorGroup } from '../../entities/types/color-types'
import { ColorForm, ColorGroupFormFields, ShadesList, CreateColorGroupSection } from '..'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { useWineColorStore } from '../../entities/wine-color-store'

export const ColorPaletteManager = () => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const store = useWineColorStore()
  const colorGroups = store.colorGroups
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
    totalCount,
    filters,
    onChangePagination,
    isReorderingGroup,
    reorderGroup,
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

  const onReorder = useCallback(
    (reorderedGroups: WineColorGroup[]) => {
      store.reorderColorGroups(
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
          <CreateColorGroupSection onCreateGroup={groups.handleAddGroup} isLoading={isLoading || isReorderingGroup} />
        </div>
        {!isLoading && colorGroups?.length === 0 && totalCount === 0 && <EmptyState type="colors" />}
        <SortableList items={colorGroups} onReorder={onReorder}>
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
              const { nameUa, nameEn } = getDisplayNames(group.translations)

              return (
                <SortableItem key={accordionKey} id={group.id} className="flex flex-col" handleClassName="top-1.5 hover:bg-transparent" gridColor={cardTextColorClass} disabled={isReorderingGroup}>
                  <AccordionWrapper
                    key={accordionKey}
                    label={`${nameUa} (${nameEn})`}
                    isOpen={isGroupOpen}
                    onToggle={() => ui.handleToggleAccordion(group.id, toggleCallbacks)}
                    style={{ backgroundColor: group.colorHex, padding: '8px' }}
                    chevronStyle={cardTextColorClass}
                    header={
                      <div className="flex justify-between items-center w-full pl-8 flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={cn('font-medium truncate', cardTextColorClass)}>
                            {nameUa} ({nameEn}) - {group.colorHex.toUpperCase()}
                          </span>
                        </div>
                        <PaletteItemActions
                          isLoading={isLoading || isReorderingGroup}
                          onRemove={handleConfirmDelete}
                          dataId={group.id}
                          cardTextColorClass={cardTextColorClass}
                          onEdit={() => groups.startEditingGroup(group.id)}
                          showEditButton={!isGroupEditing && !isReorderingGroup}
                          isHeader
                          deleteModal={() => handleOpenDeleteModal(group.id, nameUa)}
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
                            items={items.getShadesForGroup(Number(group.id))}
                            isLoading={isLoading}
                            onRemove={shadeId => items.onRemoveItem(group.id, shadeId)}
                            onEdit={shade => items.handleEditItem(group.id, shade)}
                            getItemName={items.getItemName}
                            cardTextColorClass={cardTextColorClass}
                            isEditable={isEditable}
                            showEditButton={isEditable}
                            onReorder={reorderedShades => items.handleReorderShades(group.id, reorderedShades)}
                          />

                          {isItemFormOpen && group?.shades?.length > 0 && <Separator className="mt-2" style={{ backgroundColor: group.colorHex }} />}
                        </>
                      )}

                      {isItemFormOpen && (
                        <>
                          <ColorForm
                            data={{
                              translations: newItemData[group.id]?.translations || createTranslations('', ''),
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
                </SortableItem>
              )
            })}
          </div>
        </SortableList>
        <WarningModal
          title={t('modal.delete_title', { slug: t('colors.color').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('colors.color') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}
    </Card>
  )
}
