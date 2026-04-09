import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFaqStore } from '../../entities/wine-taste-store'
import { useDeleteModal } from '@/modules/wine/create/general/presenters/useDeleteModal'
import { useTopicPalette } from '../../presenters/useTopicPalette'
import { cn, createTranslations, getDisplayNames } from '@/lib/utils'
import { Save } from 'lucide-react'
import { FaqTopic } from '../../entities/types/types'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'
import { SkeletonWinePalette } from '@/modules/wine/create/general/ui/components/skeleton-wine-palette'
import { EmptyState } from '@/modules/wine/create/general/ui/components/empty-state'
import { WarningModal } from '@/modals/warningModal'
import { CreateTopicSection, TopicFormFields, QuestionForm, QuestionList } from '..'

export const FaqView = () => {
  const { t } = useTranslation('faq')
  const { t: tc } = useTranslation('common')

  const store = useFaqStore()

  const topics = store.topics

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
  } = useTopicPalette()

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
    (reorderedGroups: FaqTopic[]) => {
      store.reorderTopics(
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

  if (isLoading && topics?.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
          <SkeletonWinePalette />
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        <div>
          <h2 className="text-2xl font-bold">{t('faq')}</h2>
          <CreateTopicSection onCreateGroup={groups.handleAddGroup} isLoading={isLoading || isReordering} />
        </div>
        {!isLoading && topics?.length === 0 && <EmptyState type="faq" />}
        <SortableList items={topics} onReorder={onReorder}>
          <div className="mx-auto flex flex-col justify-center gap-2 w-full">
            {topics?.map((group: FaqTopic) => {
              const isGroupOpen = ui.isAccordionOpen(group.id)
              const isGroupEditing = ui.isEditing(group.id)
              const isItemFormOpen = ui.isFormItemOpen(group.id)
              const isGroupFormOpen = ui.isFormGroupOpen(group.id)

              const currentEditingGroupData = editingGroupData[group.id]
              const forceOpenKey = forceOpenKeys[group.id] || 0
              const accordionKey = isGroupOpen && forceOpenKey > 0 ? `forced-${group.id}-${forceOpenKey}` : group.id
              const { nameUa, nameEn } = getDisplayNames(group.translations)

              return (
                <SortableItem key={accordionKey} id={group.id} className="flex flex-col" handleClassName="top-1.5 hover:bg-transparent" disabled={isReordering}>
                  <AccordionWrapper
                    label={`${nameUa} (${nameEn})`}
                    isOpen={isGroupOpen}
                    onToggle={() => ui.handleToggleAccordion(group.id, toggleCallbacks)}
                    style={{ padding: '10px' }}
                    header={
                      <div className="flex justify-between items-center w-full pl-8 flex-1 min-w-0">
                        <div className="flex md:items-center items-start gap-2 md:flex-row flex-col flex-1 min-w-0">
                          <span className={cn('font-medium truncate min-w-0 flex-1 text-start')}>
                            {nameUa} ({nameEn})
                          </span>
                        </div>
                        <PaletteItemActions
                          isLoading={isLoading || isReordering}
                          onRemove={handleConfirmDelete}
                          dataId={group.id}
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
                        'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-background z-20',
                        isItemFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
                        'cursor-default'
                      )}
                    >
                      {isGroupFormOpen && currentEditingGroupData && (
                        <TopicFormFields formData={currentEditingGroupData} onFormDataChange={(field, value) => groups.updateGroupFormData(group.id, field, value)} autoFocus={true} />
                      )}

                      {isGroupOpen && !isGroupFormOpen && (
                        <>
                          <QuestionList
                            items={items.getQuestionForGroup(group.id)}
                            isLoading={isLoading}
                            onRemove={id => items.onRemoveItem(group.id, id)}
                            onEdit={item => items.handleEditItem(group.id, item)}
                            getQuestionText={items.getQuestionText}
                            getAnswerText={items.getAnswerText}
                            isEditable={isEditable}
                            showEditButton={isEditable}
                            onReorder={reorderedTaste => items.handleReorderQuestion(group.id, reorderedTaste)}
                          />

                          {isItemFormOpen && group?.questions && group?.questions.length > 0 && <Separator className="mt-2" />}
                        </>
                      )}

                      {isItemFormOpen && (
                        <>
                          <QuestionForm
                            data={{
                              questionTranslations: newItemData[group.id]?.questionTranslations || createTranslations('', ''),
                              answerTranslations: newItemData[group.id]?.answerTranslations || createTranslations('', ''),
                            }}
                            onDataChange={(field, value) => {
                              if (field === 'questionTranslations') {
                                items.updateItemFormData(group.id, 'questionTranslations', value)
                              } else if (field === 'answerTranslations') {
                                items.updateItemFormData(group.id, 'answerTranslations', value)
                              }
                            }}
                            autoFocus={!editingGroup?.editingItem}
                          />
                        </>
                      )}

                      <div className={cn('w-full flex gap-3 justify-end mt-3')}>
                        {!isGroupFormOpen && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="border hover:bg-muted-foreground hover:text-input"
                            onClick={() => (isItemFormOpen ? items.handleCancelItemEdit(group.id) : items.handleAddAromaClick(group.id))}
                          >
                            {isItemFormOpen ? tc('button.cancel') : t('create_new_question')}
                          </Button>
                        )}

                        {isGroupFormOpen && (
                          <>
                            <Button size="sm" variant="ghost" className="border hover:bg-muted-foreground hover:text-input" onClick={() => groups.handleCancelGroupEdit(group.id)}>
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
          title={t('modal.delete_title', { slug: t('topic').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('topic') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </div>
    </div>
  )
}
