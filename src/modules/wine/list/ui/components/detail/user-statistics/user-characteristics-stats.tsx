import { IStatistics } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserCharacteristicsStatsProps {
  stats: IStatistics
}

export const UserCharacteristicsStats = ({ stats }: UserCharacteristicsStatsProps) => {
  const { t } = useTranslation('wines')

  return (
    stats.tasteCharacteristics &&
    stats.tasteCharacteristics.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('taste_characteristics.characteristics')}</h3>

        <div className="space-y-2">
          {stats.tasteCharacteristics.map(char => (
            <div key={char.id} className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg ">
                <div className="h-4 w-4 rounded shrink-0" style={{ backgroundColor: char.colorHex }} />
                <span className="font-medium truncate sm:max-w-[200px] max-w-[150px]">{char.name}</span>
              </div>
              {char.levels && char.levels.length > 0 && (
                <div className="flex items-center gap-1">
                  {char.levels.map(level => (
                    <div key={level.id} className="flex items-center gap-1 px-2 py-1 rounded border border-input/40">
                      <span className="text-sm font-medium">{level.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  )
}
