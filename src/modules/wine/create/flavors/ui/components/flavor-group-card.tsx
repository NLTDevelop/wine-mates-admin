import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { StateItem, WineAromaGroup } from '../../entities/types/flavor'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useEditFlavorGroup } from '../../presenters/useEditFlavorGroup'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'

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
    useEditFlavorGroup({ data, isEditable, isFormOpen, onCancel, onToggleForm })

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
        className={cn(
          'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-muted',
          isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
          'cursor-default',
          'group',
          data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
        )}
      >
        {renderableItems.length > 0 && (
          <div className="space-y-3 mt-3 hover:brightness-100 w-full">
            {renderableItems.map((item, index) => {
              const aromaItem = item?.items?.[0]
              return (
                <div key={item.id || index} className="flex gap-2 justify-between sm:items-start items-center">
                  <div className="flex gap-2 sm:flex-row flex-col  sm:items-center items-start w-full">
                    <div className=" flex gap-2 items-center w-1/5">
                      <div className="h-6 w-6 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: aromaItem?.value }}></div>
                      <div className={`text-sm font-medium`}>{getItemName(item)}</div>
                    </div>

                    {aromaItem?.state && aromaItem.state.length > 0 && (
                      <div className="flex flex-wrap gap-2 mr-4">
                        {aromaItem.state.map((stateItem: StateItem) => (
                          <span key={stateItem.id} className={cn('px-2 py-1 text-xs rounded-md border', cardTextColorClass, 'border-current/30 bg-current/10')}>
                            {stateItem.stateName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <PaletteItemActions
                    isLoading={isLoading || false}
                    onRemove={onRemove}
                    dataId={item.id}
                    cardTextColorClass={cardTextColorClass}
                    onEdit={isEditable ? () => handleEditItem(aromaItem) : undefined}
                    showEditButton={isEditable}
                    variant="row"
                  />
                </div>
              )
            })}
          </div>
        )}

        <div className={cn('w-full flex justify-end', !renderableItems.length && 'mt-3')}>
          <Button size="sm" variant="ghost" className="border-1 hover:bg-muted-foreground hover:text-input" onClick={handleAddAromaClick}>
            {isFormOpen ? t('button.cancel') : t('button.add_new_aroma')}
          </Button>
        </div>
      </div>
    </AccordionWrapper>
  )
}
