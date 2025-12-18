import { IStatistics } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserAromaStatsProps {
  stats: IStatistics
}

export const UserAromaStats = ({ stats }: UserAromaStatsProps) => {
  const { t } = useTranslation('wines')

  return (
    stats.topAromas &&
    stats.topAromas.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('flavors.flavors')}</h3>

        <div className="space-y-2">
          {stats.topAromas.map(aroma => (
            <div key={aroma.id} className="flex flex-col sm:flex-row sm:items-start sm:flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                <div className="h-4 w-4 rounded shrink-0" style={{ backgroundColor: aroma.colorHex }} />
                <span className="font-medium truncate sm:max-w-[200px] max-w-[150px]">{aroma.name}</span>
              </div>

              {aroma.subgroups && aroma.subgroups.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 sm:ml-2">
                  {aroma.subgroups.map(subgroup => (
                    <div key={subgroup.id} className="inline-flex items-center gap-1">
                      <div className="flex items-center gap-1 px-2 py-1 rounded border border-input/40">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: subgroup.colorHex }} />
                        <span className="text-sm">{subgroup.name}</span>

                        {subgroup.aromas && subgroup.aromas.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-xs">-</span>
                            {subgroup.aromas.map((subAroma, aromaIndex) => (
                              <span key={subAroma.id} className="text-xs text-gray-600">
                                {subAroma.name}
                                {aromaIndex < subgroup.aromas.length - 1 && ','}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
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
