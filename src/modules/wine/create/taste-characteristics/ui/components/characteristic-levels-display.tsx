import React from 'react'
import { useTranslation } from 'react-i18next'
import { getDisplayNames } from '@/lib/utils'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { LevelItem } from '../../entities/taste-characteristics'

interface CharacteristicLevelsDisplayProps {
  levels: LevelItem[]
  description?: string
  colorBadge?: Record<string, string>
}

export const CharacteristicLevelsDisplay: React.FC<CharacteristicLevelsDisplayProps> = ({ levels, description, colorBadge }) => {
  const { t } = useTranslation('wines')

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-description !mb-1">{t('taste_characteristics.levels')}:</h4>
        <div className="flex flex-wrap gap-2">
          {levels.map((level, index) => {
            const { nameUa } = getDisplayNames(level.translations || [])
            return (
              <Badge key={level.id || `level-${index}`} variant="outline" className="border-0" style={{ backgroundColor: colorBadge?.backgroundColor }}>
                <p className={colorBadge?.color}>
                  {index + 1}. {nameUa}
                </p>
              </Badge>
            )
          })}
        </div>
      </div>
      {description && (
        <div>
          <h4 className="text-description !mb-0">{t('taste_characteristics.description')}:</h4>
          <p className="text-md">{description}</p>
        </div>
      )}
    </div>
  )
}
