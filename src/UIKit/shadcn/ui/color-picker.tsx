import { MouseEventHandler, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Input } from '@/UIKit/shadcn/ui/input'
import { cn } from '@/lib/utils'
import { Palette } from 'lucide-react'
import { useContrastText } from '@/hooks/ui/useContrastText'
import chroma from 'chroma-js'

interface ColorPickerProps {
  value: string
  onChange?: (color: string) => void
  className?: string
  baseHexNoHash?: string
  onClick?: MouseEventHandler<HTMLInputElement>
}

export const ColorPicker = ({ value, onChange, className, baseHexNoHash, onClick }: ColorPickerProps) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const { textColorClass } = useContrastText(value)

  const baseHsl = useMemo(() => {
    if (!baseHexNoHash) return null
    try {
      const color = chroma(baseHexNoHash)
      const [h, s] = color.hsl()
      return { h: isNaN(h) ? 0 : h, s: isNaN(s) ? 0 : s }
    } catch {
      return null
    }
  }, [baseHexNoHash])

  const lightnessGradientStyle = useMemo(() => {
    if (!baseHsl) return undefined
    const steps = 20
    const gradientColors = []

    for (let i = 0; i < steps; i++) {
      const lightness = i / (steps - 1)
      const hex = chroma.hsl(baseHsl.h, baseHsl.s, lightness).hex()
      gradientColors.push(hex)
    }

    return {
      background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
    }
  }, [baseHsl])

  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!baseHsl) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.min(1, Math.max(0, clickX / rect.width))
    const lightness = ratio

    const newHex = chroma.hsl(baseHsl.h, baseHsl.s, lightness).hex()
    onChange?.(newHex)
  }

  const getIndicatorPosition = (hexValue: string) => {
    if (!hexValue || !hexValue.startsWith('#')) {
      return '0%'
    }

    try {
      const lightness = chroma(hexValue).hsl()[2]
      if (typeof lightness === 'number' && !isNaN(lightness)) {
        const position = lightness * 100
        return `calc(${Math.min(100, Math.max(0, position))}% - 16px)`
      }
    } catch (e) {
      console.warn('Chroma error on indicator position:', e)
    }

    return '0%'
  }

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
          {!lightnessGradientStyle && <HexColorPicker color={value} onChange={onChange} style={{ width: '100%' }} />}
          {lightnessGradientStyle && (
            <div className="h-6 rounded-full cursor-pointer relative mt-3" style={lightnessGradientStyle} onClick={handleGradientClick}>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7.5 h-7.5 rounded-full border-2 border-white shadow-md"
                style={{
                  backgroundColor: value,
                  left: getIndicatorPosition(value),
                  transform: `translateX(0%) translateY(0%)`,
                }}
              />
            </div>
          )}
          <Input value={value} onClick={onClick} onChange={e => onChange?.(e.target.value)} placeholder={baseHexNoHash ? baseHexNoHash : '#000000'} className="font-mono w-full" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
