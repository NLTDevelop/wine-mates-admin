import React from 'react'
import { cn } from '@/lib/utils'
import { WineAromaItem, WineAromaSubgroup } from '../../entities/types/flavor-types'
import { PaletteItemActions } from '../../../general/ui'

interface FlavorListItem {
  id: string
  items?: WineAromaItem[]
}

interface FlavorListProps {
  items: WineAromaSubgroup[]
  isLoading?: boolean
  onRemove: (id: string) => void
  onEdit?: (item: WineAromaSubgroup | undefined) => void
  getItemName: (item: FlavorListItem) => string
  cardTextColorClass: string
  isEditable?: boolean
  showEditButton?: boolean
  hexColor: string
}

export const FlavorList: React.FC<FlavorListProps> = ({ items, isLoading = false, onRemove, onEdit, getItemName, cardTextColorClass, isEditable = false, showEditButton = false, hexColor }) => {
  const handleEditClick = (aromaItem: WineAromaSubgroup | undefined) => {
    if (onEdit && isEditable) {
      onEdit(aromaItem)
    }
  }

  return (
    <div className="space-y-3 mt-3 hover:brightness-100 w-full">
      {items?.map((item, index) => {
        return (
          <div key={item.id || index} className="flex gap-2 justify-between sm:items-start items-center">
            <div className="flex gap-2 sm:flex-row flex-col sm:items-center items-start w-full">
              <div className="flex gap-2 items-center w-1/5">
                <div className="h-5 w-5 rounded-full flex-shrink-0" style={{ backgroundColor: hexColor }} />
                <div className="text-sm font-medium">{getItemName(item)}</div>
              </div>

              {item.aromas && item.aromas.length > 0 && (
                <div className="flex flex-wrap gap-2 mr-4">
                  {item.aromas.map((a: WineAromaItem) => (
                    <span key={a.id} className={cn('px-2 py-1 text-xs rounded-md border', 'border-current/30 bg-current/10')}>
                      {a.nameUa}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <PaletteItemActions
              isLoading={isLoading}
              onRemove={onRemove}
              dataId={item.id}
              cardTextColorClass={cardTextColorClass}
              onEdit={isEditable ? () => handleEditClick(item) : undefined}
              showEditButton={showEditButton}
              variant="row"
            />
          </div>
        )
      })}
    </div>
  )
}
