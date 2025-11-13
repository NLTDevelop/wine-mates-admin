import React from 'react'
import { WineShades } from '../../entities/types/color-types'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { ShadeRow } from './shade-row'

interface ShadesListProps {
  items: WineShades[]
  isLoading?: boolean
  onRemove: (id: string) => void
  onEdit?: (item: WineShades) => void
  getItemName: (item: WineShades) => string
  cardTextColorClass: string
  isEditable?: boolean
  showEditButton?: boolean
  hexColor: string
  onReorder?: (items: WineShades[]) => void
}

export const ShadesList: React.FC<ShadesListProps> = ({ items, isLoading = false, onRemove, onEdit, getItemName, cardTextColorClass, isEditable = false, showEditButton = false, onReorder }) => {
  const handleEditClick = (shade: WineShades) => {
    if (onEdit && isEditable) {
      onEdit(shade)
    }
  }

  const handleReorder = (reorderedItems: WineShades[]) => {
    if (onReorder) {
      onReorder(reorderedItems)
    }
  }

  const getShadeId = (item: WineShades, index: number): string => {
    return item.id || `shade-${index}`
  }

  return (
    <div className="mt-3 w-full">
      <SortableList items={items} onReorder={handleReorder} strategy="vertical" getId={getShadeId}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortableItem key={getShadeId(item, index)} id={getShadeId(item, index)} className="cursor-default" handleClassName="-top-1.5">
              <ShadeRow
                item={item}
                isLoading={isLoading}
                onRemove={onRemove}
                onEdit={handleEditClick}
                getItemName={getItemName}
                cardTextColorClass={cardTextColorClass}
                isEditable={isEditable}
                showEditButton={showEditButton}
              />
            </SortableItem>
          ))}
        </div>
      </SortableList>
    </div>
  )
}
