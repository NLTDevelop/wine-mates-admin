import { MouseEvent, useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/UIKit/shadcn/ui/input'

interface EditableHeaderProps {
  isEditable: boolean
  isEditing: boolean
  isSaving: boolean
  label: string
  labelEn: string
  value: string
  editValue: {
    label: string
    labelEn: string
    value: string
  }
  cardTextColorClass: string
  onStartEditing?: () => void
  onSave: (editData: { label: string; labelEn: string; value: string }) => Promise<void>
  onCancel: (e?: MouseEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onEditValueChange: (field: string, value: string) => void
  actions?: React.ReactNode
}

export const EditableHeader: React.FC<EditableHeaderProps> = ({
  isEditable,
  isEditing,
  isSaving,
  label,
  labelEn,
  value,
  editValue,
  cardTextColorClass,
  onSave,
  onCancel,
  onKeyDown,
  onEditValueChange,
  actions,
}) => {
  const [activeField, setActiveField] = useState<'label' | 'labelEn' | 'value' | null>(null)

  const handleSave = (e: MouseEvent) => {
    e.stopPropagation()
    onSave(editValue)
    setActiveField(null)
  }

  const handleCancel = (e?: MouseEvent) => {
    if (e) e.stopPropagation()
    onCancel(e)
    setActiveField(null)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(editValue)
    } else if (e.key === 'Escape') {
      handleCancel()
    }
    onKeyDown(e)
  }

  return (
    <div className="flex items-center gap-2 justify-between w-full">
      {isEditable && isEditing ? (
        <div className="flex items-end md:items-center gap-3 flex-1 flex-col flex-wrap md:flex-row justify-end md:justify-start">
          <div className="flex items-center gap-1 w-full md:w-auto justify-between">
            <span className={cn('text-xs opacity-70', cardTextColorClass)}>UA:</span>
            <Input
              value={editValue.label}
              onChange={e => onEditValueChange('label', e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isSaving}
              className={cn('h-7 text-sm bg-transparent border border-white/30 focus:border-white/50 w-32', cardTextColorClass)}
              autoFocus={activeField === 'label'}
              onClick={(e: MouseEvent) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center gap-1 w-full md:w-auto justify-between">
            <span className={cn('text-xs opacity-70', cardTextColorClass)}>EN:</span>
            <Input
              value={editValue.labelEn}
              onChange={e => onEditValueChange('labelEn', e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isSaving}
              className={cn('h-7 text-sm bg-transparent border border-white/30 focus:border-white/50 w-32', cardTextColorClass)}
              autoFocus={activeField === 'labelEn'}
              onClick={(e: MouseEvent) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center gap-1 w-full md:w-auto justify-between">
            <span className={cn('text-xs opacity-70', cardTextColorClass)}>Color:</span>
            <div className="flex items-center gap-1">
              <Input
                value={editValue.value}
                onChange={e => onEditValueChange('value', e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isSaving}
                className={cn('h-7 text-sm bg-transparent border border-white/30 focus:border-white/50 w-24 font-mono', cardTextColorClass)}
                autoFocus={activeField === 'value'}
                onClick={(e: MouseEvent) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ">
            <div onClick={handleSave} className={cn('p-0 opacity-60 hover:opacity-100 cursor-pointer', cardTextColorClass)}>
              <Check className="h-4 w-4" />
            </div>
            <div onClick={handleCancel} className={cn('p-0 opacity-60 hover:opacity-100 cursor-pointer', cardTextColorClass)}>
              <X className="h-4 w-4" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-1md:gap-4 items-start md:items-center text-start flex-1 cursor-pointer flex-wrap flex-col md:flex-row min-w-0">
          <div className="flex items-end  gap-2 w-full md:w-[25%] min-h-6 min-w-0">
            <span className={cn('text-label **flex items-center** whitespace-normal break-words min-w-0', cardTextColorClass)}>{label}</span>
          </div>

          <div className="flex items-end gap-2 w-full md:w-[25%] h-6">
            <span className={cn('text-label flex items-center opacity-70 text-sm', cardTextColorClass)}>{labelEn}</span>
          </div>

          <div className="flex items-end gap-2 w-full md:w-[25%] h-6">
            <span className={cn('text-label font-mono text-sm', cardTextColorClass)}>{value}</span>
          </div>
        </div>
      )}
      {actions}
    </div>
  )
}
