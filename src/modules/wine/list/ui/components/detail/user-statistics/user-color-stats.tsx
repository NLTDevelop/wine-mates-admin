import { IStatistics } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserColorStatsProps {
  stats: IStatistics
}
export const UserColorStats = ({ stats }: UserColorStatsProps) => {
  const { t } = useTranslation('wines')
  return (
    stats.topColors &&
    stats.topColors.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('colors.colors')}</h3>

        <div className="space-y-2">
          {stats.topColors.map(color => (
            <div key={color.id} className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                <div className="h-4 w-4 rounded shrink-0" style={{ backgroundColor: color.colorHex }} />
                <span className="font-medium truncate sm:max-w-[400px] max-w-[150px]">{color.name}</span>
              </div>
              {color.shades && color.shades.length > 0 && (
                <div className="flex items-center gap-1">
                  {color.shades.map(shade => (
                    <div key={shade.id} className="flex items-center gap-1 px-2 py-1 rounded border border-input/40">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: shade.colorHex }} />
                      <span className="text-sm">{shade.name}</span>
                      <span className="text-xs text-gray-400 ml-1">({shade.tone})</span>
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
