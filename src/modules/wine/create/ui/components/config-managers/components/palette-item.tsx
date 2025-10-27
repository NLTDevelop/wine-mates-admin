import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { Trash2, Check } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { WineColor, WineColorItem } from '../../../../entities/types/color'

export type PaletteItemData =
  | WineColor
  | {
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
}

export const PaletteItem = ({ data, isNeedCopy = false, onRemove, isLoading, onItemClick, variant = 'color', handleClick }: PaletteItemProps) => {
  const { t } = useTranslation('wines')
  const [copied, setCopied] = useState(false)

  const color = data.value[0] === '#' ? data.value : '#ffffff'

  const { textColorClass: cardTextColorClass, mutedTextColorClass: cardMutedTextColorClass } = useContrastText(color)

  const handleCopy = async () => {
    if (!isNeedCopy) return
    try {
      await navigator.clipboard.writeText(data.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy error-> ', err)
    }
  }

  const handleMainClick = () => {
    if (isNeedCopy && variant === 'color') {
      handleCopy()
    } else {
      if (onItemClick) {
        onItemClick(data)
      } else if (handleClick) {
        handleClick()
      }
    }
  }

  const getItemName = (item: string | WineColorItem): string => {
    return typeof item === 'string' ? item : item?.name || ''
  }

  const getItemTones = (item: string | WineColorItem) => {
    return typeof item === 'string' ? undefined : item?.tones
  }

  return (
    <div
      onClick={handleMainClick}
      style={{ backgroundColor: color }}
      className={cn(
        'relative flex h-auto min-h-8 w-full items-start justify-between p-3 transition-all rounded-md',
        'hover:brightness-90',
        isNeedCopy || onItemClick || handleClick ? 'cursor-pointer hover:brightness-100' : 'cursor-default',
        cardTextColorClass,
        'group',
        data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
      )}
    >
      <div className="flex flex-col items-start overflow-hidden text-left flex-1">
        <span className={cn('text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis h-8 flex items-center', cardTextColorClass)}>{data.label}</span>

        {isNeedCopy ? (
          <span className={cn('text-xs font-mono', cardMutedTextColorClass)}>{copied ? t('copied') : data.value}</span>
        ) : (
          <>
            {data.colorLabel && <div className={cn('text-xs', cardMutedTextColorClass)}>{data.colorLabel}</div>}

            {data.items && data.items.length > 0 && variant === 'category' && (
              <div className="space-y-2 mt-3 hover:brightness-100">
                {data.items.map((item, index) => {
                   const itemName = getItemName(item)
                  const itemTones = getItemTones(item)
                  return (
                  
                  <div key={index} className="">
                    <div className="font-medium mb-2 text-sm">{itemName}</div>
                    <div className="flex gap-2">
                      {(['pale', 'medium', 'deep'] as const).map(tone => {
                        const toneColor = itemTones?.[tone]
                        const { textColorClass } = useContrastText(`#${toneColor}`)

                        return (
                          <div key={tone} className="flex-1 text-center">
                            <div className="w-full h-6 flex items-center justify-center " style={{ backgroundColor: `#${toneColor}` }}>
                              <span className={cn('text-[12px] font-mono font-bold px-1 py-0.5 ', textColorClass)}>{tone}</span>
                              <span className={cn('text-[12px] font-mono font-bold px-1 py-0.5 ', textColorClass)}>#{toneColor}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )})}
              </div>
            )}
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation()
          onRemove(data.value)
        }}
        disabled={isLoading}
        className={cn(cardTextColorClass, 'p-1.5 opacity-70 hover:opacity-100 flex-shrink-0')}
      >
        {isNeedCopy && copied ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  )
}
