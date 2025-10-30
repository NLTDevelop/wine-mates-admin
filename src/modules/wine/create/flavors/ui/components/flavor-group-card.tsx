import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { PaletteItemActions } from '../../../colors/ui/components/palette-item-actions'
import { WineAromaGroup } from '../../entities/types/flavor'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useEditFlavorGroup } from '../../presenters/useEditFlavorGroup'
import { EditableHeader } from '../../../general/ui/editable-header'

interface FlavorGroupCardProps {
  data: WineAromaGroup
  onRemove: (id: string) => void
  onEditItem?: (groupId: string, item: any) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
  isAccordionOpen: { [groupId: string]: boolean }
  handleToggleAccordion: (groupId: string, isOpen: boolean) => void
}

export const FlavorGroupCard = ({
  data,
  onRemove,
  onEditItem,
  isLoading,
  isEditable = false,
  onToggleForm,
  isFormOpen = false,
  onCancel,
  isAccordionOpen,
  handleToggleAccordion,
}: FlavorGroupCardProps) => {
  const { t } = useTranslation('wines')

  const { isEditing, editValue, color, cardTextColorClass, isSaving, renderableItems, startEditing, handleSaveLabel, cancelEditing, handleKeyDown, handleAddAromaClick, setEditValue, getItemName } =
    useEditFlavorGroup({
      data,
      isEditable,
      isFormOpen,
      onCancel,
      onToggleForm,
    })

  const isOpenAccordion = isAccordionOpen[data.id] || false

  const handleToggle = (isOpen: boolean) => {
    if (isEditing) {
      return
    }
    handleToggleAccordion(data.id, isOpen)

    if (!isOpen && isFormOpen) {
      onToggleForm?.()
    }
  }

  const handleEditItem = (item: any) => {
    onEditItem?.(data.id, item)
  }

  return (
    <AccordionWrapper
      label={`${data.label} (${data.value})`}
      isOpen={isOpenAccordion}
      onToggle={handleToggle}
      style={{ backgroundColor: color }}
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
            />
          }
        />
      }
    >
      <div
        className={cn(
          'relative flex flex-col h-auto min-h-8 w-full items-start justify-between p-3 pt-0 transition-all flex-1 bg-input/50',
          isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
          'cursor-default',
          'group',
          data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
        )}
      >
        {renderableItems.length > 0 && (
          <div className="space-y-2 mt-3 hover:brightness-100 w-full">
            {renderableItems.map((item, index) => (
              <div key={item.id || index} className="flex gap-2 justify-between items-start ">
                <div className="flex gap-2 flex-1 justify-between items-center">
                  <div className="text-sm">{getItemName(item)}</div>
                </div>

                <PaletteItemActions
                  isLoading={isLoading || false}
                  onRemove={onRemove}
                  dataId={item.id}
                  cardTextColorClass={cardTextColorClass}
                  onEdit={isEditable ? () => handleEditItem(item) : undefined}
                  showEditButton={isEditable}
                />
              </div>
            ))}
          </div>
        )}

        <div className="w-full flex justify-end mt-4">
          <Button size="sm" variant="ghost" className="border-1" onClick={handleAddAromaClick}>
            {isFormOpen ? t('button.cancel') : t('button.add_new_aroma')}
          </Button>
        </div>
      </div>
    </AccordionWrapper>
  )
}
