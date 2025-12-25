import React from 'react'
import { useTranslation } from 'react-i18next'
import { getDisplayNameDescription, getDisplayNames, lightenColor } from '@/lib/utils'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { LevelItem, WineTasteCharacteristics } from '../../entities/taste-characteristics'

interface CharacteristicLevelsDisplayProps {
  levels: LevelItem[]
  group: WineTasteCharacteristics
  colorBadge?: Record<string, string>
  qtyLevels: 2 | 3
}

export const CharacteristicLevelsDisplay: React.FC<CharacteristicLevelsDisplayProps> = ({ levels, group, colorBadge, qtyLevels }) => {
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
              <Badge
                key={level.id || `level-${index}`}
                variant="outline"
                className="border-0"
                style={{ backgroundColor: /*level.isEnabled ? colorBadge?.backgroundColor :*/ lightenColor(colorBadge?.backgroundColor ?? '', 10) }}
              >
                <p className={/*level.isEnabled ?*/ colorBadge?.color /*: 'text-[#d1d1d1]'*/}>{nameUa}</p>
              </Badge>
            )
          })}
        </div>
      </div>
      <div>
        <h4 className="text-description !mb-0">{t('taste_characteristics.qty_levels')}:</h4>
        <p className="text-md">{qtyLevels ? qtyLevels : 'чекаю бєк для відображення кількості рівнів'}</p>
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
