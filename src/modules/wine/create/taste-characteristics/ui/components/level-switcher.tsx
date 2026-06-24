'use client'

import { cn } from '@/lib/utils'
import { Card } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'

interface LevelSwitcherProps {
  value: 2 | 3
  onChange: (value: 2 | 3) => void
}

export function LevelSwitcher({ value, onChange }: LevelSwitcherProps) {
  const { t } = useTranslation('wines')

  return (
    <Card className="space-y-3 mb-3 max-w-75">
      <label className="text-description">{t('taste_characteristics.qty_levels')}</label>
      <div className="relative sm:w-64 w-40 h-12 bg-muted/40 rounded-xl mx-auto mt-2">
        <div
          className={cn('absolute top-1 h-10 bg-background rounded-lg shadow-sm transition-all duration-300', value === 2 ? 'left-1 sm:w-28 w-20' : 'sm:left-[140px]  left-[87.5px] sm:w-28 w-20')}
        />

        <div className="relative flex items-center h-full">
          <button
            type="button"
            onClick={() => onChange(2)}
            className={cn(
              'flex-1 h-full flex flex-col items-center justify-center text-sm font-medium z-10 transition-colors duration-200',
              value === 2 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="font-bold">2 {t('taste_characteristics.level')}</span>
          </button>

          <button
            type="button"
            onClick={() => onChange(3)}
            className={cn(
              'flex-1 h-full flex flex-col items-center justify-center text-sm font-medium z-10 transition-colors duration-200',
              value === 3 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="font-bold">3 {t('taste_characteristics.level')}</span>
          </button>
        </div>
      </div>
    </Card>
  )
}
