import React from 'react'
import { useTranslation } from 'react-i18next'
import { getDisplayNameDescription, getDisplayNames } from '@/lib/utils'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { LevelItem, WineTasteCharacteristics } from '../../entities/taste-characteristics'

interface CharacteristicLevelsDisplayProps {
  levels: LevelItem[]
  group: WineTasteCharacteristics
  colorBadge?: Record<string, string>
}

export const CharacteristicLevelsDisplay: React.FC<CharacteristicLevelsDisplayProps> = ({ levels, group, colorBadge }) => {
  const { t } = useTranslation('wines')

  const { descriptionUa } = getDisplayNameDescription(group.translations || [])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-description !mb-1">{t('taste_characteristics.levels')}:</h4>
        <div className="flex flex-wrap gap-2">
          {levels.map((level, index) => {
            const { nameUa } = getDisplayNames(level.translations || [])
            return (
              <Badge key={level.id || `level-${index}`} variant="outline" className="border-0" style={{ backgroundColor: colorBadge?.backgroundColor }}>
                <p className={colorBadge?.color}>{nameUa}</p>
              </Badge>
            )
          })}
        </div>
      </div>
      {descriptionUa && (
        <div>
          <h4 className="text-description !mb-0">{t('description')}:</h4>
          <p className="text-md">{descriptionUa}</p>
        </div>
      )}
    </div>
  )
}
