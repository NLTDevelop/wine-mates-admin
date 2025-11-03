import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useEditTasteCharacteristic } from '../../presenters/useEditTasteCharacteristic'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { LevelItem, WineTasteCharacteristics } from '../../entities/types/taste-characteristics'
import { LevelManager } from './level-manager'

interface TasteCharacteristicCardProps {
  data: WineTasteCharacteristics
  onRemove: (id: string) => void
  onEditItem?: (characteristicId: string, item: any) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: () => void
  onUpdateCharacteristic: (id: string, updates: { label?: string; labelEn?: string }) => Promise<WineTasteCharacteristics | void>
  isAccordionOpen: { [characteristicId: string]: boolean }
  handleToggleAccordion: (characteristicId: string, isOpen: boolean) => void
  characteristicLevels?: LevelItem[]
  onCharacteristicLevelsChange?: (levels: LevelItem[]) => void
  editData?: {
    label: string
    labelEn: string
  }
  onEditDataChange?: (field: string, value: string) => void
}

export const TasteCharacteristicCard = ({
  data,
  onRemove,
  isLoading,
  isEditable = false,
  onToggleForm,
  isFormOpen = false,
  onCancel,
  onUpdateCharacteristic,
  isAccordionOpen,
  handleToggleAccordion,
  characteristicLevels = [],
  onCharacteristicLevelsChange,
  editData,
  onEditDataChange,
}: TasteCharacteristicCardProps) => {
  const { t } = useTranslation('wines')

  const { isEditing, editValue, isSaving, startEditing, handleSaveLabel, cancelEditing, handleKeyDown, setEditValue, handleAddItemClick } = useEditTasteCharacteristic({
    data,
    isEditable,
    isFormOpen,
    onCancel,
    onToggleForm,
    onUpdateCharacteristic,
  })

  const handleEditValueChange = (field: string, value: string) => {
    setEditValue(prev => ({
      ...prev,
      [field]: value,
    }))
  }

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

  const levelsToShow = characteristicLevels.length > 0 ? characteristicLevels : data.levels || []

  return (
    <AccordionWrapper
      label={`${data.label} (${data.levels?.length || 0})`}
      isOpen={isOpenAccordion}
      onToggle={handleToggle}
      style={{ padding: '8px' }}
      header={
        <EditableHeader
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving}
          label={data.label}
          labelEn={data.labelEn || ''}
          value={data.levels?.length || 0} 
          editValue={{
            label: editData?.label || editValue.label, 
            labelEn: editData?.labelEn || editValue.labelEn,
            value: String(data.levels?.length || 0), 
          }}
          cardTextColorClass="text-gray-800"
          onStartEditing={startEditing}
          onSave={handleSaveLabel}
          onCancel={cancelEditing}
          onKeyDown={handleKeyDown}
          onEditValueChange={(field, value) => {
            if (onEditDataChange) {
              onEditDataChange(field, value) 
            } else {
              handleEditValueChange(field, value) 
            }
          }}
          actions={
            <PaletteItemActions
              isLoading={isLoading || false}
              onRemove={() => onRemove(data.id)}
              dataId={data.id}
              cardTextColorClass="text-gray-800"
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
          'group'
        )}
      >
        {isOpenAccordion && (
          <div className="w-full mb-4 p-4 border rounded-md bg-white">
            <h4 className="text-sm font-medium mb-3">{t('taste_characteristics.manage_levels') || 'Manage Levels'}</h4>
            <LevelManager 
              states={levelsToShow} 
              onStatesChange={onCharacteristicLevelsChange || (() => {})} 
            />
          </div>
        )}

        <div className={cn('w-full flex justify-end', 'mt-3')}>
          <Button 
            size="sm" 
            variant="ghost" 
            className="border-1" 
            onClick={handleAddItemClick}
          >
            {isFormOpen ? t('button.cancel') : t('button.add_new_taste')}
          </Button>
        </div>
      </div>
    </AccordionWrapper>
  )
}