import React, { useCallback } from 'react'
import { cn, getDisplayNames } from '@/lib/utils'
import { WineAromaItem, WineAromaSubgroup } from '../../entities/types/flavor-types'
import { PaletteItemActions } from '../../../general/ui'
import { useDeleteModal } from '../../../general/presenters/useDeleteModal'
import { WarningModal } from '@/modals/warningModal'
import { useTranslation } from 'react-i18next'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'


interface FlavorListProps {
  items: WineAromaSubgroup[]
  isLoading?: boolean
  onRemove: (id: string) => void
  onEdit?: (item: WineAromaSubgroup | undefined) => void
  getItemName: (item: WineAromaSubgroup) => string
  cardTextColorClass: string
  isEditable?: boolean
  showEditButton?: boolean
  hexColor: string
   onReorder?: (reorderedSubgr: WineAromaSubgroup[]) => void
}

export const FlavorList: React.FC<FlavorListProps> = ({ items, isLoading = false, onRemove, onEdit, getItemName, cardTextColorClass, isEditable = false, showEditButton = false, hexColor, onReorder }) => {
  const { t } = useTranslation('wines')

  const handleEditClick = (aromaItem: WineAromaSubgroup | undefined) => {
    if (onEdit && isEditable) {
      onEdit(aromaItem)
    }
  }

  const { deleteModal } = useDeleteModal()

  const handleOpenDeleteModal = useCallback(
    (item: WineAromaSubgroup) => {
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

  const getAromaName = (aroma: WineAromaItem) => {
    const { nameUa } = getDisplayNames(aroma.translations || [])
    return nameUa || ''
  }

   const handleReorder = (reorderedSubgr: WineAromaSubgroup[]) => {
      onReorder?.(reorderedSubgr)
    }

  
  return (
    <SortableList items={items} onReorder={handleReorder}>
    <div className="space-y-3 mt-3 hover:brightness-100 w-full">
      {items?.map((item, index) => {
      const itemColor = item.colorHex || hexColor
        return (
          <SortableItem key={item.id || index} id={item.id} className="flex gap-2 justify-between sm:items-start items-center " handleClassName='-top-1 -left-1 hover:bg-transparent' gridColor='text-transparent'>
            <div className="flex gap-2 sm:flex-row flex-col sm:items-center items-start w-full">
              <div className="flex gap-2 items-center w-1/5">
                <div className="h-5 w-5 rounded-full flex-shrink-0" style={{ backgroundColor: itemColor }} />
                <div className="text-sm font-medium">{getItemName(item)}</div>
              </div>

              {item.aromas && item.aromas.length > 0 && (
                <div className="flex flex-wrap gap-2 mr-4">
                  {item.aromas.map((a: WineAromaItem) => (
                    <span key={a.id} className={cn('px-2 py-1 text-xs rounded-md border', 'border-current/30 bg-current/10')}>
                       {getAromaName(a)}
                    </span>
                  ))}
                </div>
              )}
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
        title={t('modal.delete_title', { slug: t("flavors.flavor_shade").toLowerCase })}
        actionTitle={t('modal.delete_action')}
        description={t('modal.delete_description', { name: deleteModal.nameUa, slug: t("flavors.flavor_shade") })}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onSubmit={handleConfirmDelete}
      />
    </div>
    </SortableList>
  )
}
