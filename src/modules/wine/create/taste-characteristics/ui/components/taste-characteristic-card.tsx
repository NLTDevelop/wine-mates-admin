import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useEditTasteCharacteristic } from '../../presenters/useEditTasteCharacteristic'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { LevelItem, WineTasteCharacteristics } from '../../entities/types/taste-characteristics'
import { LevelManager } from '..'
import { useCallback } from 'react'
import { useWineTasteCharacteristics } from '../../presenters/useWineTasteCharacteristics'
import { useDebounce } from '@/hooks/ui/useDebounce'

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
  const { t: tc } = useTranslation('common')

  const { isReorderingCharacteristicLevels, updateCharacteristicLevels } = useWineTasteCharacteristics()

  const { isEditing, editValue, isSaving, startEditing, handleSaveLabel, cancelEditing, handleKeyDown, setEditValue, updateCurrentLevels } = useEditTasteCharacteristic({
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

  const saveLevelsToServer = useCallback(
    async (levels: LevelItem[]) => {
      try {
        await updateCharacteristicLevels(data.id, levels)
      } catch (error) {
        console.error('Failed to save levels:', error)
      }
    },
    [data.id, updateCharacteristicLevels]
  )

  const { debouncedWrapper } = useDebounce(saveLevelsToServer, 1000)

  const handleLevelsChange = useCallback(
    (levels: LevelItem[]) => {
      updateCurrentLevels(levels)
      onCharacteristicLevelsChange?.(levels)

      debouncedWrapper(levels)
    },
    [updateCurrentLevels, onCharacteristicLevelsChange, debouncedWrapper]
  )

  const isOpenAccordion = isAccordionOpen[data.id] || false

  const handleToggle = (isOpen: boolean) => {
    handleToggleAccordion(data.id, isOpen)

    if (!isOpen && isFormOpen) {
      onToggleForm?.()
    }
  }

  const levelsToShow = characteristicLevels.length > 0 ? characteristicLevels : data.levels || []

  return (
    <AccordionWrapper
      label={`${data.label} (${characteristicLevels.length > 0 ? characteristicLevels.length : data.levels?.length || 0})`}
      isOpen={isOpenAccordion}
      onToggle={handleToggle}
      style={{ backgroundColor: '#fffbfb', padding: '8px' }}
      header={
        <EditableHeader
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving || isReorderingCharacteristicLevels}
          label={data.label}
          labelEn={data.labelEn || ''}
          value={characteristicLevels.length > 0 ? characteristicLevels.length : data.levels?.length || 0}
          editValue={{
            label: editData?.label || editValue.label,
            labelEn: editData?.labelEn || editValue.labelEn,
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
              isLoading={isLoading || isSaving || isReorderingCharacteristicLevels}
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
      {isOpenAccordion && (
        <div
          className={cn(
            'relative flex flex-col h-auto min-h-8 w-full items-start justify-between pl-1 pr-1 sm:pl-3 sm:pr-6 pb-2 pt-0 mt-2 transition-all flex-1 bg-muted/40',
            isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
            'cursor-default',
            'group'
          )}
        >
          <LevelManager states={levelsToShow} onStatesChange={handleLevelsChange} />

          {/* индикатор сохранения (может потом уберу) */}
          {isReorderingCharacteristicLevels && <div className="text-xs text-blue-500 mt-2 text-center">{tc('button.saving')}...</div>}
        </div>
      )}
    </AccordionWrapper>
  )
}
