import { Card } from '@/UIKit/shadcn/ui/card'
import { Droplet, Grape } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TasteCharacteristic } from '../../../../entities/types/statistics-types'

interface TasteStatsProps {
  tasteCharacteristics: TasteCharacteristic[]
  height?: number
  showLegend?: boolean
}

export default function TasteCharacteristicsStats({ tasteCharacteristics, height = 12 }: TasteStatsProps) {
  const { t } = useTranslation('rate')
  const { t: tw } = useTranslation('wines')

  const totalUsers = useMemo(() => tasteCharacteristics.reduce((sum, tc) => sum + tc.userCount, 0), [tasteCharacteristics])

  const sortedCharacteristics = [...tasteCharacteristics].sort((a, b) => a.userCount - b.userCount).reverse()

  return totalUsers > 0 ? (
    <Card className="w-full space-y-3 mt-4">
      <h2 className="text-lg font-bold flex gap-2 items-center">
        <Grape size={20} />
        {tw('taste_characteristics.characteristics')}
      </h2>

      <div className="w-full overflow-hidden rounded-full bg-muted flex" style={{ height }}>
        {sortedCharacteristics
          .filter(char => char.userCount > 0)
          .map(char => {
            const percent = (char.userCount / totalUsers) * 100
            return (
              <div
                key={char.id}
                title={`${char.name}: ${char.userCount} (${percent.toFixed(1)}%)`}
                style={{ width: `${percent}%`, backgroundColor: char.colorHex }}
                className="px-1 h-full transition-all"
              />
            )
          })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sortedCharacteristics
          .filter(char => char.userCount > 0)
          .map((char, idx) => {
            const totalLevelsInThisChar = useMemo(() => char.levels?.reduce((sum, level) => sum + (level.userCount || 0), 0) || 0, [char.levels])

            return (
              <Card key={char.id} className="space-y-3 !w-full min-w-0 p-4 bg-accent">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: char.colorHex }} />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <span className={`text-foreground ${idx === 0 && 'font-bold'} break-words word-wrap-break-word overflow-wrap-anywhere`}>{char.name}</span>{' '}
                        <span className="text-gray-500 text-sm whitespace-nowrap">({t('user', { count: char.userCount })})</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{((char.userCount / totalUsers) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {totalLevelsInThisChar > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Droplet size={14} />
                      <span>{tw('taste_characteristics.levels').toLowerCase()}:</span>
                    </div>
                  </div>
                )}

                {char.levels.length > 0 && (
                  <div className="space-y-2">
                    {char.levels
                      .filter(level => level.userCount > 0)
                      .sort((a, b) => b.userCount - a.userCount)
                      .map((level, i) => (
                        <div key={level.id} className="space-y-1 p-2 bg-gray-50 rounded">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <div
                                className="w-4 h-4 rounded flex-shrink-0"
                                style={{
                                  backgroundColor: char.colorHex,
                                  opacity: 0.7,
                                }}
                              />
                              <span className={`text-sm ${i === 0 && 'font-bold'} break-words word-wrap-break-word overflow-wrap-anywhere flex-1 min-w-0`}>{level.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">({t('user', { count: level.userCount })})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            )
          })}
      </div>
    </Card>
  ) : null
}
