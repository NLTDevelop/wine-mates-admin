import React, { useCallback, useEffect, useState } from 'react'
import { getDisplayNames } from '@/lib/utils'
import { WarningModal } from '@/modals/warningModal'
import { useTranslation } from 'react-i18next'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { FaqQuestion } from '../../entities/types/types'
import { useDeleteModal } from '@/modules/wine/create/general/presenters/useDeleteModal'
import { PaletteItemActions } from '@/modules/wine/create/general/ui'

interface QuestionListProps {
  items: FaqQuestion[]
  isLoading?: boolean
  onRemove: (id: string) => void
  onEdit?: (item: FaqQuestion | undefined) => void
  getQuestionText: (item: FaqQuestion) => string
  getAnswerText: (item: FaqQuestion) => string
  isEditable?: boolean
  showEditButton?: boolean
  onReorder?: (reorderedTaste: FaqQuestion[]) => void
}

export const QuestionList: React.FC<QuestionListProps> = ({ items, isLoading = false, onRemove, onEdit, getQuestionText, getAnswerText, isEditable = false, showEditButton = false, onReorder }) => {
  const { t } = useTranslation('wines')

  const [localItems, setLocalItems] = useState<FaqQuestion[]>(items)

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const handleEditClick = (tasteItem: FaqQuestion | undefined) => {
    if (onEdit && isEditable) {
      onEdit(tasteItem)
    }
  }

  const { deleteModal } = useDeleteModal()

  const handleOpenDeleteModal = useCallback(
    (item: FaqQuestion) => {
      const { nameUa: questionUa } = getDisplayNames(item.questionTranslations)
      deleteModal.open(item.id, questionUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      onRemove(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, onRemove])

  const handleReorder = (reorderedTaste: FaqQuestion[]) => {
    setLocalItems(reorderedTaste)
    onReorder?.(reorderedTaste)
  }

  const getItemId = useCallback((item: FaqQuestion, index: number): string => {
    return item.id || `taste-${index}`
  }, [])

  return (
    <SortableList items={localItems} onReorder={handleReorder} strategy="vertical" getId={getItemId}>
      <div className="space-y-3 mt-3 hover:brightness-100 w-full">
        {items?.map((item, index) => {
          return (
            <SortableItem
              key={item.id || index}
              id={item.id}
              className="flex gap-2 justify-between sm:items-start items-center border rounded-md border-foreground/10 shadow-sm"
              handleClassName="-top-0.5 -left-1 hover:bg-transparent"
            >
              <div>
                <div className="flex gap-2 sm:flex-row flex-col sm:items-center items-start w-full">
                  <div className="flex gap-2 items-center">
                    <div className="h-5 w-5 rounded-full shrink-0" />
                    <h2 className="text-lg font-bold">{getQuestionText(item)}</h2>
                  </div>
                </div>

                <p className="text-sm font-medium pl-10 py-2">{getAnswerText(item)}</p>
              </div>
              <PaletteItemActions
                isLoading={isLoading}
                onRemove={handleConfirmDelete}
                dataId={item.id}
                onEdit={isEditable ? () => handleEditClick(item) : undefined}
                showEditButton={showEditButton}
                variant="row"
                deleteModal={() => handleOpenDeleteModal(item)}
              />
            </SortableItem>
          )
        })}

        <WarningModal
          title={t('modal.delete_title', { slug: t('question').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('question') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </div>
    </SortableList>
  )
}
