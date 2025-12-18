import { Card } from '@/UIKit/shadcn/ui/card'
import { Palette, Droplet } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TopColor } from '../../../../entities/types/statistics-types'

interface ColorStatsProps {
  topColor: TopColor[]
  height?: number
}

export default function ColorStats({ topColor, height = 12 }: ColorStatsProps) {
  const { t } = useTranslation('rate')
  const { t: tw } = useTranslation('wines')

  const totalUsers = useMemo(() => topColor.reduce((sum, c) => sum + c.userCount, 0), [topColor])
  const sortedColors = [...topColor].sort((a, b) => a.userCount - b.userCount).reverse()

  return totalUsers > 0 ? (
    <Card className="w-full space-y-3 mt-4">
      <h2 className="text-lg font-bold flex gap-2 items-center">
        <Palette size={20} />
        {tw('colors.colors')}
      </h2>

      <div className="w-full overflow-hidden rounded-full bg-muted flex" style={{ height }}>
        {sortedColors.map(color => {
          const percent = (color.userCount / totalUsers) * 100
          return (
            <div
              key={color.id}
              title={`${color.name}: ${color.userCount} (${percent.toFixed(1)}%)`}
              style={{ width: `${percent}%`, backgroundColor: color.colorHex }}
              className="px-1 h-full transition-all"
            />
          )
        })}
      </div>

      <div
        className="gap-2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {sortedColors.map((color, idx) => {
          const totalShadesInThisColor = useMemo(() => color.shades?.reduce((sum, shade) => sum + (shade.userCount || 0), 0) || 0, [color.shades])

          return (
            <Card key={color.id} className="space-y-3 !w-full min-w-0 p-4 bg-accent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: color.colorHex }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-foreground ${idx === 0 && 'font-bold'} truncate`}>{color.name}</span>
                    <span className="text-gray-500 text-sm whitespace-nowrap">({t('user', { count: color.userCount })})</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 font-mono">{color.colorHex}</span>
                    <span className="text-sm text-foreground">{((color.userCount / totalUsers) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {totalShadesInThisColor > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Droplet size={14} />
                    <span>{tw('colors.shades')}:</span>
                  </div>
                  <div className="w-full overflow-hidden rounded-full bg-gray-100" style={{ height: 8 }}>
                    {color.shades
                      .filter(shade => shade.userCount > 0)
                      .map(shade => {
                        const shadePercent = (shade.userCount / totalShadesInThisColor) * 100
                        return (
                          <div
                            key={shade.id}
                            title={`${shade.name}: ${shade.userCount}`}
                            style={{
                              width: `${shadePercent}%`,
                              backgroundColor: shade.colorHex,
                              float: 'left',
                              height: '100%',
                            }}
                            className="transition-all"
                          />
                        )
                      })}
                  </div>
                </div>
              )}

              {color.shades.length > 0 && (
                <div className="space-y-2">
                  {color.shades
                    .filter(shade => shade.userCount > 0)
                    .map(shade => (
                      <div key={shade.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: shade.colorHex }} />
                          <div className="flex-1 min-w-0 relative">
                            <div className="flex items-baseline">
                              <span className={`text-sm truncate`}>{shade.name} </span>
                              <sup className="text-xs text-primary font-bold ml-2 truncate">{shade.userCount} </sup>
                            </div>
                            {shade.tone && shade.tone !== shade.colorHex && (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: shade.tone }} />
                                <span className="text-xs text-gray-500 truncate">{shade.tone}</span>
                              </div>
                            )}
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
