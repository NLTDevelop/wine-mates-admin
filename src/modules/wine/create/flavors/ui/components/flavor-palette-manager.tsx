import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { CreateFlavorGroupSection } from './create-flavor-group-section'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { FlavorList } from './flavor-list'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, lightenColor } from '@/lib/utils'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { AromasManager, FlavorForm, FlavorGroupFormFields } from '..'
import { useFlavorPalette } from '../../presenters/useFlavorPalette'
import { BaseWineColor } from '../../../general/entities/types'
import { WineAromaGroup } from '../../entities/types/flavor-types'
import { SkeletonWinePalette } from '../../../general/ui/components/skeleton-wine-palette'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { EmptyState } from '../../../general/ui/components/empty-state'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { useCallback } from 'react'
import { WarningModal } from '@/modals/warningModal'

interface FlavorPaletteManagerProps {
  cachedColors: BaseWineColor[]
  colorsLoading?: boolean
}

export const FlavorPaletteManager = ({ cachedColors, colorsLoading = false }: FlavorPaletteManagerProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { deleteModal } = useDeleteModal()

  const {
    aromaGroups,
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
  } = useFlavorPalette(cachedColors)

  const isEditable = true

  const toggleCallbacks = {
    setOpenAccordions,
    setEditingGroup,
    setNewItemData,
    setEditingGroupData,
  }

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

  if (isLoading && aromaGroups?.length === 0) {
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
          <CreateFlavorGroupSection onCreateGroup={groups.handleAddGroup} isLoading={isLoading} cachedColors={cachedColors} />
        </div>
        {!isLoading && aromaGroups?.length === 0 && totalCount === 0 && <EmptyState type="aromas" />}
        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {aromaGroups?.map((group: WineAromaGroup) => {
            const { textColorClass: cardTextColorClass } = useContrastText(group.colorHex)

            const isGroupOpen = ui.isAccordionOpen(group.id)
            const isGroupEditing = ui.isEditing(group.id)
            const isItemFormOpen = ui.isFormItemOpen(group.id)
            const isGroupFormOpen = ui.isFormGroupOpen(group.id)

            const subgroup = group.subgroups?.[0]
            const itemsList = subgroup?.aromas || []

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
                    <div className="flex justify-between items-center w-full ">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-medium', cardTextColorClass)}>
                          {group.nameUa} ({group.nameEn})
                        </span>
                        {group?.colors?.map((c: BaseWineColor) => (
                          <div key={c.id} className="bg-amber-50 px-2 rounded-md">
                            <span className=" text-sm text-foreground">{c.nameUa}</span>
                          </div>
                        ))}
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
                      <FlavorGroupFormFields
                        formData={currentEditingGroupData}
                        onFormDataChange={(field, value) => groups.updateGroupFormData(group.id, field, value)}
                        cachedColors={cachedColors}
                        isLoading={isLoading || colorsLoading}
                        autoFocus={true}
                      />
                    )}

                    {isGroupOpen && !isGroupFormOpen && (
                      <>
                        <FlavorList
                          items={group.subgroups}
                          isLoading={isLoading}
                          onRemove={id => items.onRemoveItem(group.id, id)}
                          onEdit={item => items.handleEditItem(group.id, item)}
                          getItemName={items.getItemName}
                          cardTextColorClass={cardTextColorClass}
                          isEditable={isEditable}
                          showEditButton={isEditable}
                          hexColor={`${lightenColor(group.colorHex, 40)}`}
                        />

                        {isItemFormOpen && group.subgroups.length > 0 && <Separator className="mt-2" style={{ backgroundColor: group.colorHex }} />}
                      </>
                    )}

                    {isItemFormOpen && (
                      <>
                        <FlavorForm
                          data={{
                            name: newItemData[group.id]?.name || '',
                            nameEn: newItemData[group.id]?.nameEn || '',
                          }}
                          onDataChange={(field, value) => {
                            items.updateItemFormData(group.id, field as 'name' | 'nameEn', value)
                          }}
                          nameLabel={t('flavors.aroma_name_ua')}
                          nameEnLabel={t('flavors.aroma_name_en')}
                          namePlaceholder={t('flavors.aroma_name_ua')}
                          nameEnPlaceholder={t('flavors.aroma_name_en')}
                          autoFocus={!editingGroup?.editingItem}
                        />

                        <AromasManager
                          aromas={newItemData[group.id]?.aromas || []}
                          onAromasChange={newAromas => {
                            setNewItemData(prev => ({
                              ...prev,
                              [group.id]: {
                                ...prev[group.id],
                                aromas: newAromas,
                              },
                            }))
                          }}
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
                          {isItemFormOpen ? t('button.cancel') : t('button.add_new_aroma')}
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
          title={t('modal.delete_title', { slug: 'аромат' })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: 'Aромат' })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </CardContent>
      {totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={filters.limit} page={filters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}
    </Card>
  )
}
