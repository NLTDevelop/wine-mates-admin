import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { Check, X } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { WineColor, WineColorItem } from '../../../../entities/types/color'
import { PaletteItemActions } from './palette-iItem-actions'
import { Input } from '@/UIKit/shadcn/ui/input'
import { usePaletteItem } from '@/modules/wine/create/presenters/usePaletteItem'

export type PaletteItemData =
  | WineColor
  | {
      id?: string
      value: string
      label: string
      items?: (string | WineColorItem)[]
      colorLabel?: string
      tones?: { pale?: string; medium?: string; deep?: string }
    }

interface PaletteItemProps {
  data: PaletteItemData
  isNeedCopy?: boolean
  onRemove: (value: string) => void
  isLoading?: boolean
  onItemClick?: (data: PaletteItemData) => void
  variant?: 'category' | 'color'
  handleClick?: () => void
  isEditable?: boolean
  categoryId?: string
  onEditColor?: (color: WineColor) => void
  onToggleForm?: () => void
  isFormOpen?: boolean
}

export const PaletteItem = ({
  data,
  isNeedCopy = false,
  onRemove,
  isLoading,
  onItemClick,
  variant = 'color',
  handleClick,
  isEditable = false,
  categoryId,
  onEditColor,
  onToggleForm,
  isFormOpen = false,
}: PaletteItemProps) => {
  const { t } = useTranslation('wines')

  const {
    copied,
    isEditing,
    editValue,
    color,
    cardTextColorClass,
    cardMutedTextColorClass,
    isSaving,
    startEditing,
    cancelEditing,
    handleSaveLabel,
    handleKeyDown,
    handleMainClick,
    handleCopy,
    getItemName,
    getItemTones,
    getRenderableItems,
    setEditValue,
  } = usePaletteItem({
    data,
    isNeedCopy,
    onItemClick,
    handleClick,
    variant,
    isEditable,
    categoryId,
  })

  const renderableItems = getRenderableItems()

  const handleCardClick = () => {
    if (isNeedCopy && variant === 'color') {
      handleCopy()
    }
  }

  const handleAddShadeClick = () => {
    if (onToggleForm) {
      onToggleForm()
    }
  }

  return (
    <div
      onClick={handleMainClick}
      style={{ backgroundColor: color }}
      className={cn(
        'relative flex flex-col h-auto min-h-8 w-full items-start justify-between p-3 transition-all',
        'hover:brightness-90',
        isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-md',
        isNeedCopy ? 'cursor-pointer hover:brightness-100' : 'cursor-default',
        cardTextColorClass,
        'group',
        data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
      )}
    >
      <div className="flex items-start justify-between w-full">
        {isEditable && isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              className={cn('h-8 text-label bg-transparent border border-white/30 focus:border-white/50', cardTextColorClass)}
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleSaveLabel} disabled={isSaving} className={cn('h-6 w-6 p-0', cardTextColorClass)}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={isSaving} className={cn('h-6 w-6 p-0', cardTextColorClass)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <span className={cn('text-label whitespace-nowrap overflow-hidden text-ellipsis h-8 flex items-center flex-1', cardTextColorClass)}>{data.label}</span>
        )}
        <PaletteItemActions
          copied={copied}
          isNeedCopy={isNeedCopy}
          isLoading={isLoading || false}
          handleMainClick={handleCardClick}
          onRemove={onRemove}
          dataValue={data.value}
          cardTextColorClass={cardTextColorClass}
          onEdit={isEditable ? startEditing : undefined}
          showEditButton={isEditable && !isEditing}
        />
      </div>

      {isNeedCopy ? (
        <span className={cn('text-xs font-mono', cardMutedTextColorClass)}>{copied ? t('copied') : data.value}</span>
      ) : (
        <>
          {data.colorLabel && <div className={cn('text-xs', cardMutedTextColorClass)}>{data.colorLabel}</div>}
          {renderableItems.length > 0 && variant === 'category' && (
            <div className="space-y-2 mt-3 hover:brightness-100 w-full">
              {renderableItems.map((item, index) => {
                const itemName = getItemName(item)
                const itemTones = getItemTones(item)
                if (typeof item !== 'string') {
                  return (
                    <div key={item.id || index} className="flex gap-2 justify-between items-start sm:items-end flex-col sm:flex-row ">
                      <div className="flex gap-2 flex-1 justify-between items-center">
                        <div className="text-sm">{itemName}</div>
                        <div className="flex gap-2 ">
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
                        copied={copied}
                        isNeedCopy={isNeedCopy}
                        isLoading={isLoading || false}
                        handleMainClick={handleMainClick}
                        onRemove={onRemove}
                        dataValue={data.value}
                        cardTextColorClass={cardTextColorClass}
                        onEdit={onEditColor ? () => onEditColor(item) : undefined}
                        showEditButton={isEditable && !isEditing && !!onEditColor}
                      />
                    </div>
                  )
                }
                return (
                  <div key={index} className="flex gap-2 justify-between items-start sm:items-end flex-col sm:flex-row ">
                    <div className="flex gap-2 flex-1 justify-between items-center">
                      <div className="text-sm">{itemName}</div>
                      <div className="flex gap-2 ">
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
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
      <div className="w-full flex justify-end">
        <Button size="sm" variant="ghost" className="border-1" onClick={handleAddShadeClick}>
          {isFormOpen ? 'Скасувати ' : 'Додати відтінок'}
        </Button>
      </div>
    </div>
  )
}
