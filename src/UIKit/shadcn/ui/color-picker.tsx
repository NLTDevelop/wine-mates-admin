import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Input } from '@/UIKit/shadcn/ui/input'
import { cn } from '@/lib/utils'
import { Palette } from 'lucide-react'
import { useContrastText } from '@/hooks/ui/useContrastText'

interface ColorPickerProps {
  value: string
  onChange?: (color: string) => void
  className?: string
}

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const {textColorClass} = useContrastText(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" style={{ backgroundColor: value || undefined }} className={cn('w-full h-11 justify-start gap-2 bg-background', `hover:${textColorClass}`, textColorClass, className)}>
          <span className={cn('flex-1 text-sm text-left', value ? textColorClass : 'text-muted-foreground')}>{value || t('choose_color')}</span>
          <Palette className={cn('w-6 h-6', textColorClass)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-4 border-0"
        align="start"
        style={{
          width: 'var(--radix-popover-trigger-width)',
          maxWidth: 'var(--radix-popover-trigger-width)',
        }}
      >
        <div className="space-y-3">
          <HexColorPicker color={value} onChange={onChange} style={{ width: '100%' }} />
          <Input value={value} onChange={e => onChange?.(e.target.value)} placeholder="#000000" className="font-mono w-full" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
