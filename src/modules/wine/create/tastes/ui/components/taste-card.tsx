import { cn } from '@/lib/utils'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { useEditTaste } from '../../presenters/useEditTaste'
import { WineTaste } from '../../entities/types/tastes'
import { useWineOptionsMock } from '../../../general/presenters/useWineOptions'

interface TasteCardProps {
  data: WineTaste
  onRemove: (id: string) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
}

export const TasteCard = ({ data, onRemove, isLoading, isEditable = false, onToggleForm, isFormOpen = false, onCancel }: TasteCardProps) => {
  const { fetchColors } = useWineOptionsMock()
  const { isEditing, editValue, color, cardTextColorClass, isSaving, startEditing, handleSaveLabel, cancelEditing, handleKeyDown, setEditValue, colorValues, handleColorChange } = useEditTaste({
    data,
    isEditable,
    isFormOpen,
    onCancel,
    onToggleForm,
    fetchColors,
  })

  return (
    <div className={cn('border-1 border-input rounded-md transition-all')} style={{ backgroundColor: color }}>
      <div className="p-2">
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
          colorValues={colorValues}
          handleColorChange={handleColorChange} 
          fetchColors={fetchColors} 
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
      </div>
    </div>
  )
}
