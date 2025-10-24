import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { Trash2, Check } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'

export interface PaletteItemData {
  value: string
  label: string
  items?: string[]
  colorLabel?: string
}

interface PaletteItemProps {
  data: PaletteItemData
  isNeedCopy?: boolean
  onRemove: (value: string) => void
  isLoading?: boolean
  onItemClick?: (data: PaletteItemData) => void
}

export const PaletteItem = ({ data, isNeedCopy = false, onRemove, isLoading, onItemClick }: PaletteItemProps) => {
  const { t } = useTranslation('wines')
  const [copied, setCopied] = useState(false)

  const color = data.value[0]==="#"?data.value : "#ffffff"

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

  const mainClickHandler = isNeedCopy ? handleCopy : () => (onItemClick ? () => onItemClick(data) : undefined)

  return (
    <Button
      variant="ghost"
      onClick={mainClickHandler}
      disabled={isLoading}
      style={{ backgroundColor: color }}
      className={cn(
        'relative flex h-auto min-h-16 w-full items-center justify-between p-3 transition-all ',
        'hover:brightness-90',
        isNeedCopy || onItemClick
          ? 'cursor-pointer hover:brightness-90'
          : 'cursor-default',
        cardTextColorClass,
        'group',
        data.items && data.items.length > 0 ? 'gap-2' : 'gap-4'
      )}
    >
      <div className="flex flex-col items-start overflow-hidden text-left flex-1">
        <span className={cn('text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis', cardTextColorClass)}>{data.label}</span>

        {isNeedCopy ? (
          <span className={cn('text-xs font-mono', cardMutedTextColorClass)}>{copied ? t('copied') : data.value}</span>
        ) : (
          <>
            {data.colorLabel && <div className={cn('text-xs', cardMutedTextColorClass)}>{data.colorLabel}</div>}
            {data.items && data.items.length > 0 && <div className={cn('text-xs pr-1 mt-1 italic', cardMutedTextColorClass, 'whitespace-normal')}>{data.items.join(', ')}</div>}
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
    </Button>
  )
}
