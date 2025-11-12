import { cn } from '@/lib/utils'
import { EditableHeader, PaletteItemActions } from '../../../general/ui'
import { useWineOptionsMock } from '../../../general/presenters/useWineOptions'
import { WineType } from '../../entities/types/wine-type'
import { useEditWineType } from '../../presenters/useEditWineType'

interface WineTypeCardProps {
  data: WineType
  onRemove: (id: string) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
}

export const WineTypeCard = ({ data, onRemove, isLoading, isEditable = false, onToggleForm, isFormOpen = false, onCancel }: WineTypeCardProps) => {
  const { fetchColors } = useWineOptionsMock()
  const { isEditing, editValue, isSaving, startEditing, handleSaveLabel, cancelEditing, handleKeyDown, setEditValue, colorValues, handleColorChange } = useEditWineType({
    data,
    isEditable,
    isFormOpen,
    onCancel,
    onToggleForm,
    fetchColors,
  })

  return (
    <div className={cn('border-1 border-input rounded-md transition-all cursor-default')}>
      <div className="p-2">
        <EditableHeader
          isEditable={isEditable}
          isEditing={isEditing}
          isSaving={isSaving}
          label={data.label || ''}
          labelEn={data.labelEn || ''}
          editValue={editValue}
          cardTextColorClass="!mb-0"
          onStartEditing={startEditing}
          onSave={handleSaveLabel}
          onCancel={cancelEditing}
          onKeyDown={handleKeyDown}
          onEditValueChange={setEditValue}
          colorValues={colorValues}
          handleColorChange={handleColorChange}
          fetchColors={fetchColors}
          actions={
            <PaletteItemActions isLoading={isLoading || false} onRemove={onRemove} dataId={data.id} onEdit={isEditable ? startEditing : undefined} showEditButton={isEditable && !isEditing} isHeader />
          }
        />
      </div>
    </div>
  )
}
