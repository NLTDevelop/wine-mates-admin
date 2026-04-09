import { Button } from '@/UIKit/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Input } from '@/UIKit/shadcn/ui/input'
import { DollarSign, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RangeFilterHeaderProps {
  column: string
  label: string
  onFilter: (column: string, value: any) => void
  currentMin?: number | null
  currentMax?: number | null
}

export const RangeFilterHeader = ({ column, label, onFilter, currentMin, currentMax }: RangeFilterHeaderProps) => {
  const { t } = useTranslation('common')
  const { t: tw } = useTranslation('wines')
  const [min, setMin] = useState<string>(currentMin?.toString() ?? '')
  const [max, setMax] = useState<string>(currentMax?.toString() ?? '')

  const isActive = !!(currentMin || currentMax)

  const handleApply = () => {
    onFilter(column, {
      min: min ? Number(min) : null,
      max: max ? Number(max) : null,
    })
  }

  const handleClear = () => {
    setMin('')
    setMax('')
    onFilter(column, { min: null, max: null })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`focus-visible:ring-0 hover:text-input/50 hover:bg-transparent focus:border-none active:bg-transparent active:border-none p-0 font-medium ${isActive ? 'text-primary' : ''}`}
        >
          <span className="flex gap-2 text-sm">
            {label}
            <DollarSign className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 bg-[#2e2e38]" align="start">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex gap-2 items-center justify-between border-b ">
          <span>{tw('filtering')}</span>
          {isActive && (
            <Button variant="delete" size="sm" className="h-6 px-2 text-xs" onClick={handleClear}>
              <X className="h-3 w-3 mr-1" />
              <span>{t('button.clear')}</span>
            </Button>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Input type="number" placeholder={t('from')} value={min} onChange={e => setMin(e.target.value)} min="0" step="1" className="h-8 w-24 text-sm" />
            <span className="text-muted-foreground">-</span>
            <Input type="number" placeholder={t('to')} value={max} onChange={e => setMax(e.target.value)} min="0" step="1" className="h-8 w-24 text-sm" />
          </div>

          <Button size="sm" onClick={handleApply} className="w-full h-5">
            {t('button.apply')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
