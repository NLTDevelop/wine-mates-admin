import React, { useCallback, useEffect, useState } from 'react'
import { getDisplayNames } from '@/lib/utils'
import { PaletteItemActions } from '../../../general/ui'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { WarningModal } from '@/modals/warningModal'
import { useTranslation } from 'react-i18next'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { WineTasteItem } from '../../entities/types/tastes'

interface TasteListProps {
  items: WineTasteItem[]
  isLoading?: boolean
  onRemove: (id: string) => void
  onEdit?: (item: WineTasteItem | undefined) => void
  getItemName: (item: WineTasteItem) => string
  cardTextColorClass: string
  isEditable?: boolean
  showEditButton?: boolean
  hexColor: string
  onReorder?: (reorderedTaste: WineTasteItem[]) => void
}

export const TasteList: React.FC<TasteListProps> = ({
  items,
  isLoading = false,
  onRemove,
  onEdit,
  getItemName,
  cardTextColorClass,
  isEditable = false,
  showEditButton = false,
  hexColor,
  onReorder,
}) => {
  const { t } = useTranslation('wines')

  const [localItems, setLocalItems] = useState<WineTasteItem[]>(items)

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const handleEditClick = (tasteItem: WineTasteItem | undefined) => {
    if (onEdit && isEditable) {
      onEdit(tasteItem)
    }
  }

  const { deleteModal } = useDeleteModal()

  const handleOpenDeleteModal = useCallback(
    (item: WineTasteItem) => {
      const { nameUa } = getDisplayNames(item.translations)
      deleteModal.open(item.id, nameUa)
    },
    [deleteModal]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteModal.id) {
      onRemove(deleteModal.id)
      deleteModal.close()
    }
  }, [deleteModal, onRemove])

  const handleReorder = (reorderedTaste: WineTasteItem[]) => {
    setLocalItems(reorderedTaste)
    onReorder?.(reorderedTaste)
  }

  const getItemId = useCallback((item: WineTasteItem, index: number): string => {
    return item.id || `taste-${index}`
  }, [])

  return (
    <SortableList items={localItems} onReorder={handleReorder} strategy="vertical" getId={getItemId}>
      <div className="space-y-3 mt-3 hover:brightness-100 w-full">
        {items?.map((item, index) => {
          const itemColor = item.colorHex || hexColor
          return (
            <SortableItem
              key={item.id || index}
              id={item.id}
              className="flex gap-2 justify-between sm:items-start items-center "
              handleClassName="-top-1 -left-1 hover:bg-transparent"
              gridColor="text-transparent"
            >
              <div className="flex gap-2 sm:flex-row flex-col sm:items-center items-start w-full">
                <div className="flex gap-2 items-center w-1/5">
                  <div className="h-5 w-5 rounded-full flex-shrink-0" style={{ backgroundColor: itemColor }} />
                  <div className="text-sm font-medium">{getItemName(item)}</div>
                </div>
              </div>

              <PaletteItemActions
                isLoading={isLoading}
                onRemove={handleConfirmDelete}
                dataId={item.id}
                cardTextColorClass={cardTextColorClass}
                onEdit={isEditable ? () => handleEditClick(item) : undefined}
                showEditButton={showEditButton}
                variant="row"
                deleteModal={() => handleOpenDeleteModal(item)}
              />
            </SortableItem>
          )
        })}

        <WarningModal
          title={t('modal.delete_title', { slug: t('tastes.taste').toLowerCase() })}
          actionTitle={t('modal.delete_action')}
          description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t('tastes.taste') })}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onSubmit={handleConfirmDelete}
        />
      </div>
    </SortableList>
  )
}
