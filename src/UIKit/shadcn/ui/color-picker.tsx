import { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HexColorPicker } from 'react-colorful'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Input } from '@/UIKit/shadcn/ui/input'
import { cn } from '@/lib/utils'
import { Palette } from 'lucide-react'
import { useContrastText } from '@/hooks/ui/useContrastText'
import chroma from 'chroma-js'
import z from 'zod'

interface ColorPickerProps {
  value: string
  onChange?: (color: string) => void
  className?: string
  baseHexNoHash?: string
  onClick?: MouseEventHandler<HTMLInputElement>
}

export const strictHexColorSchema = z
  .string()
  .optional()
  .refine(val => {
    if (!val || val === '') return true
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)
  }, 'Invalid HEX color format')
  .transform(val => {
    if (!val || val === '') return ''
    if (!val.startsWith('#')) val = '#' + val

    if (val.length === 4) {
      return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`
    }
    return val
  })

export const colorFormSchema = z.object({
  color: z
    .string()
    .refine(val => {
      if (!val) return true
      try {
        chroma(val)
        return true
      } catch {
        return false
      }
    }, 'Invalid color')
    .transform(val => {
      if (!val) return ''
      try {
        return chroma(val).hex()
      } catch {
        return val
      }
    }),
})

export const ColorPicker = ({ value, onChange, className, baseHexNoHash, onClick }: ColorPickerProps) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (newValue === '') {
      onChange?.('')
      setError(null)
      return
    }

    let valueToValidate = newValue
    if (newValue && !newValue.startsWith('#') && /^[A-Fa-f0-9]{1,6}$/.test(newValue)) {
      valueToValidate = '#' + newValue
    }

    const result = strictHexColorSchema.safeParse(valueToValidate)

    if (result.success) {
      onChange?.(result.data)
      setError(null)
    } else {
      setError(t('invalid_color_format') || 'Invalid color format')
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" style={{ backgroundColor: value || '#fcfaf3' }} className={cn('w-full h-11 justify-start gap-2 bg-background', `hover:${textColorClass}`, textColorClass, className)}>
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
          <Input
            value={inputValue || ''}
            onClick={onClick}
            onChange={handleInputChange}
            placeholder={baseHexNoHash ? baseHexNoHash : '#000000'}
            className={cn('font-mono w-full', error && '!border-red-500 focus-visible:ring-red-500')}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
