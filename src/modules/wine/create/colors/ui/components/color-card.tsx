import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { usePaletteItem } from '@/modules/wine/create/colors/presenters/usePaletteItem'
import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineColor, WineColorItem } from '../../entities/types/color'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { SortableShades } from './sortable'
import { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'

export type ColorCardData = WineColor

interface ColorCardProps {
  data: ColorCardData
  onRemove: (id: string) => void
  isLoading?: boolean
  isEditable?: boolean
  onEditColor?: (colorId: string, item: WineColorItem) => void
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
  handleToggleAccordion: (colorId: string, isOpen: boolean) => void
  isAccordionOpen: { [colorId: string]: boolean }
  onShadesDragEnd?: (event: DragEndEvent, colorId: string) => void
}

export const ColorCard = ({ data, onRemove, isLoading, isEditable = false, onEditColor, onToggleForm, isFormOpen = false, onCancel, handleToggleAccordion, isAccordionOpen }: ColorCardProps) => {
  const { t } = useTranslation('wines')

  const {
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    isSaving,
    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    handleMainClick,
    handleAddShadeClick,
    getItemName,
    getItemTones,
    renderableItems,
    setEditValue,
  } = usePaletteItem({
    data,
    isEditable,
    isFormOpen,
    onCancel,
    onToggleForm,
  })

  const handleToggle = (isOpen: boolean) => {
    handleToggleAccordion(data.id, isOpen)
    if (isFormOpen) {
      onToggleForm?.()
    }
  }

  return (
    <AccordionWrapper
      label={`${data.label} (${data.value})`}
      isOpen={isAccordionOpen[data.id] || false}
      onToggle={handleToggle}
      style={{ backgroundColor: color, padding: '8px' }}
      chevronStyle={cardTextColorClass}
      header={
        <EditableHeader
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving}
          label={data.label}
          labelEn={data.labelEn || ''}
          value={data.value}
          editValue={editValue}
          cardTextColorClass={cardTextColorClass}
          onStartEditing={startEditing}
          onSave={handleSaveLabel}
          onCancel={cancelEditing}
          onKeyDown={handleKeyDown}
          onEditValueChange={setEditValue}
          actions={
            <PaletteItemActions
              isLoading={isLoading || false}
              onRemove={onRemove}
              dataId={data.id}
              cardTextColorClass={cardTextColorClass}
              onEdit={isEditable ? startEditing : undefined}
              showEditButton={isEditable && !isEditing}
              isHeader
            />
          }
        />
      }
    >
      <div
        onClick={handleMainClick}
        className={cn(
          'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2  transition-all flex-1  bg-muted',
          isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
          'cursor-default',
          'group',
          data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
        )}
      >
        {renderableItems.length > 0 && (
          <SortableContext items={renderableItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mt-3 hover:brightness-100 w-full">
              {renderableItems.map((item, index) => {
                const itemName = getItemName(item)
                const itemTones = getItemTones(item)

                return (
                  <SortableShades shades={item} key={item.id || index}>
                    {({ attributes, listeners }) => (
                      <div className="flex gap-2 justify-between items-center flex-row p-2 border-input border rounded sm:border-none sm:p-0">
                        <div className="flex gap-2 flex-1 justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <div
                              {...attributes}
                              {...listeners}
                              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors select-none touch-none"
                              onClick={e => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="h-6 w-6  rounded-full" style={{ backgroundColor: item.shade }} />
                            <div className="text-sm">{itemName}</div>
                          </div>
                          <div className="flex gap-2 flex-col sm:flex-row">
                            {(['pale', 'medium', 'deep'] as const).map(tone => {
                              const toneColor = itemTones?.[tone]
                              const { textColorClass } = useContrastText(`${toneColor}`)
                              return (
                                <div key={tone} className="flex-1 text-center">
                                  <div className="w-full h-6 flex items-center justify-center border-1 rounded-sm px-1 py-0.5" style={{ backgroundColor: `${toneColor}` }}>
                                    <span className={cn('text-[12px] font-mono font-bold pr-0.5', textColorClass)}>{tone}</span>
                                    <span className={cn('text-[12px] font-mono font-bold', textColorClass)}>{toneColor}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <PaletteItemActions
                          isLoading={isLoading || false}
                          onRemove={onRemove}
                          dataId={item.id}
                          onEdit={onEditColor ? () => onEditColor(data.id, item as WineColorItem) : undefined}
                          showEditButton={isEditable && !isEditing && !!onEditColor}
                          variant="col"
                        />
                      </div>
                    )}
                  </SortableShades>
                )
              })}
            </div>
          </SortableContext>
        )}

        <div className={cn('w-full flex justify-end', !renderableItems.length && 'mt-3')}>
          <Button size="sm" variant="ghost" className="border-1 w-full sm:w-auto" onClick={handleAddShadeClick}>
            {isFormOpen ? t('button.cancel') : t('button.add_new_shade')}
          </Button>
        </div>
      </div>
    </AccordionWrapper>
  )
}
