// import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useEditTasteCharacteristic } from '../../presenters/useEditTasteCharacteristic'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { LevelItem, WineTasteCharacteristics } from '../../entities/types/taste-characteristics'
import { LevelManager } from '..'
import { useCallback } from 'react'
// import { useWineTasteCharacteristics } from '../../presenters/useWineTasteCharacteristics'
import { BaseWineColor } from '../../../general/entities/types'
import { useWineOptions } from '../../../general/presenters/useWineOptions'

interface TasteCharacteristicCardProps {
  data: WineTasteCharacteristics
  onRemove: (id: string) => void
  onEditItem?: (characteristicId: string, item: any) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: () => void
  onUpdateCharacteristic: (id: string, updates: { nameUa?: string; nameEn?: string }) => Promise<WineTasteCharacteristics | void>
  isAccordionOpen: { [characteristicId: string]: boolean }
  handleToggleAccordion: (characteristicId: string, isOpen: boolean) => void
  characteristicLevels?: LevelItem[]
  onCharacteristicLevelsChange?: (levels: LevelItem[]) => void
  editData?: {
    label: string
    labelEn: string
  }
  onEditDataChange?: (field: string, value: string | BaseWineColor[]) => void
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
  onEditDataChange,
}: TasteCharacteristicCardProps) => {
  // const { t: tc } = useTranslation('common')

  // const { isReorderingCharacteristicLevels, updateCharacteristicLevels } = useWineTasteCharacteristics()
  const { fetchColors } = useWineOptions()

  const { isEditing, editValue, isSaving, startEditing, handleSaveNameUa, cancelEditing, handleKeyDown, setEditValue, updateCurrentLevels, colorValues, handleColorChange } =
    useEditTasteCharacteristic({
      data,
      isEditable,
      isFormOpen,
      onCancel,
      onToggleForm,
      onUpdateCharacteristic,
      fetchColors,
    })

  const handleEditValueChange = (field: string, value: string | BaseWineColor[]) => {
    setEditValue(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // const handleSaveLevelName = useCallback(
  //   async (levelId: string, levelName: string) => {
  //     try {
  //       await updateCharacteristicLevels(data.id, [
  //         ...(characteristicLevels.length > 0 ? characteristicLevels : data.levels || []).map(level => (level.id === levelId ? { ...level, levelName } : level)),
  //       ])
  //     } catch (error) {
  //       console.error('Failed to save level name:', error)
  //     }
  //   },
  //   [data.id, characteristicLevels, data.levels, updateCharacteristicLevels]
  // )

  // const handleSaveLevelsOrder = useCallback(
  //   async (levels: LevelItem[]) => {
  //     try {
  //       await updateCharacteristicLevels(data.id, levels)
  //     } catch (error) {
  //       console.error('Failed to save levels order:', error)
  //     }
  //   },
  //   [data.id, updateCharacteristicLevels]
  // )

  const handleLevelsChange = useCallback(
    (levels: LevelItem[]) => {
      updateCurrentLevels(levels)
      onCharacteristicLevelsChange?.(levels)
    },
    [updateCurrentLevels, onCharacteristicLevelsChange]
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
      label={`${data.nameUa} (${characteristicLevels.length > 0 ? characteristicLevels.length : data.levels?.length || 0})`}
      isOpen={isOpenAccordion}
      onToggle={handleToggle}
      style={{ backgroundColor: '#fffbfb', padding: '8px' }}
      header={
        <EditableHeader
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving /*|| isReorderingCharacteristicLevels*/}
          label={data.nameUa}
          labelEn={data.nameEn || ''}
          value={characteristicLevels.length > 0 ? characteristicLevels.length : data.levels?.length || 0}
          editValue={editValue}
          cardTextColorClass="text-gray-800"
          onStartEditing={startEditing}
          onSave={handleSaveNameUa}
          onCancel={cancelEditing}
          onKeyDown={handleKeyDown}
          onEditValueChange={(field, value) => {
            if (onEditDataChange) {
              onEditDataChange(field, value)
            } else {
              handleEditValueChange(field, value)
            }
          }}
          colorValues={colorValues}
          handleColorChange={handleColorChange}
          fetchColors={fetchColors}
          actions={
            <PaletteItemActions
              isLoading={isLoading || isSaving /*|| isReorderingCharacteristicLevels*/}
              onRemove={() => onRemove(data.id)} //исправить
              dataId={data.id}
              cardTextColorClass="text-gray-800"
              onEdit={isEditable ? startEditing : undefined}
              showEditButton={isEditable && !isEditing}
              isHeader
              deleteModal={() => onRemove(data.id)} //исправить
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
          <LevelManager
            states={levelsToShow}
            onStatesChange={handleLevelsChange}
            onLevelNameBlur={() => {} /*handleSaveLevelName*/}
            onLevelsOrderChange={() => {} /*handleSaveLevelsOrder*/}
            isSaving={isSaving /*|| isReorderingCharacteristicLevels*/}
          />

          {/* индикатор сохранения (может потом уберу) */}
          {/* {isReorderingCharacteristicLevels && <div className="text-xs text-blue-500 mt-2 text-center">{tc('button.saving')}...</div>} */}
        </div>
      )}
    </AccordionWrapper>
  )
}
