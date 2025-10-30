import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { usePaletteItem } from '@/modules/wine/create/colors/presenters/usePaletteItem'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { WineColor } from '../../entities/types/color'
import { PaletteItemActions } from '..'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { MouseEvent, useState } from 'react'

export type ColorCardData = WineColor

interface ColorCardProps {
  data: ColorCardData
  onRemove: (id: string) => void
  isLoading?: boolean
  isEditable?: boolean
  onEditColor?: (color: WineColor) => void
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
}

export const ColorCard = ({ data, onRemove, isLoading, isEditable = false, onEditColor, onToggleForm, isFormOpen = false, onCancel }: ColorCardProps) => {
  const { t } = useTranslation('wines')

  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

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

  return (
    <AccordionWrapper
      label={`${data.label} (${data.value})`}
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      style={{ backgroundColor: color }}
      chevronStyle={cardTextColorClass}
      header={
        <div className={`flex items-start gap-2 justify-between w-full bg-${color}`}>
          {isEditable && isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSaving}
                className={cn('h-8 text-label bg-transparent border border-white/30 focus:border-white/50', cardTextColorClass)}
                autoFocus
                onClick={(e: MouseEvent) => e.stopPropagation()}
              />
              <div onClick={(e: MouseEvent) => handleSaveLabel(e)} className={cn('p-0 opacity-60 hover:opacity-100', cardTextColorClass)}>
                <Check className="h-4 w-4" />
              </div>
              <div onClick={(e: MouseEvent) => cancelEditing(e)} className={cn('p-0 opacity-60 hover:opacity-100', cardTextColorClass)}>
                <X className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-end">
              <span className={cn('text-label flex items-center flex-1', cardTextColorClass)}>
                {data.label} ({data.value})
              </span>
            </div>
          )}
          <PaletteItemActions
            isLoading={isLoading || false}
            onRemove={onRemove}
            dataId={data.id}
            cardTextColorClass={cardTextColorClass}
            onEdit={isEditable ? startEditing : undefined}
            showEditButton={isEditable && !isEditing}
          />
        </div>
      }
    >
      <div
        onClick={handleMainClick}
        // style={{ backgroundColor: color }}
        className={cn(
          'relative flex flex-col h-auto min-h-8 w-full items-start justify-between p-3 transition-all flex-1  bg-input/50',
          isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-t-none rounded-b-md',
          'cursor-default',
          // cardTextColorClass,
          'group',
          data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
        )}
      >
        {/* <div className="flex items-start gap-2 justify-between w-full">
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
            <div className="flex gap-2 items-end">
              <span className={cn('text-label flex items-center flex-1', cardTextColorClass)}>
                {data.label} ({data.value})
              </span>
            </div>
          )}
          <PaletteItemActions
            isLoading={isLoading || false}
            onRemove={onRemove}
            dataId={data.id}
            cardTextColorClass={cardTextColorClass}
            onEdit={isEditable ? startEditing : undefined}
            showEditButton={isEditable && !isEditing}
          />
        </div> */}

        {renderableItems.length > 0 && (
          <div className="space-y-2 mt-3 hover:brightness-100 w-full">
            {renderableItems.map((item, index) => {
              const itemName = getItemName(item)
              const itemTones = getItemTones(item)

              return (
                <div key={item.id || index} className="flex gap-2 justify-between items-start sm:items-end flex-col sm:flex-row">
                  <div className="flex gap-2 flex-1 justify-between items-center">
                    <div className="text-sm">{itemName}</div>
                    <div className="flex gap-2">
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
                    onEdit={onEditColor ? () => onEditColor(item as WineColor) : undefined}
                    showEditButton={isEditable && !isEditing && !!onEditColor}
                  />
                </div>
              )
            })}
          </div>
        )}
        <div className="w-full flex justify-end mt-4">
          <Button size="sm" variant="ghost" className="border-1" onClick={handleAddShadeClick}>
            {isFormOpen ? t('button.cancel') : t('button.add_new_shade')}
          </Button>
        </div>
      </div>
    </AccordionWrapper>
  )
}
