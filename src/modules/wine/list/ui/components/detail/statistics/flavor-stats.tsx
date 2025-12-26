import { Card } from '@/UIKit/shadcn/ui/card'
import { Utensils } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TopFlavor } from '../../../../entities/types/statistics-types'

interface FlavorStatsProps {
  topFlavors: TopFlavor[]
  height?: number
  showLegend?: boolean
}

export default function FlavorStats({ topFlavors, height = 12 }: FlavorStatsProps) {
  const { t } = useTranslation('rate')
  const { t: tw } = useTranslation('wines')

  const totalUsers = useMemo(() => topFlavors.reduce((sum, f) => sum + f.userCount, 0), [topFlavors])
  const sortedFlavors = [...topFlavors].sort((a, b) => b.userCount - a.userCount)

  return totalUsers > 0 ? (
    <Card className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex gap-2 items-center">
          <Utensils size={18} />
          {tw('tastes.tastes')}:
        </h2>
      </div>
      <div className="w-full overflow-hidden rounded-full bg-gray-100 flex" style={{ height }}>
        {sortedFlavors.map(flavor => {
          const percent = (flavor.userCount / totalUsers) * 100
          return (
            <div
              key={flavor.id}
              title={`${flavor.name}: ${flavor.userCount} (${percent.toFixed(1)}%)`}
              style={{
                width: `${percent}%`,
                backgroundColor: flavor.colorHex,
              }}
              className="h-full transition-all hover:opacity-90"
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sortedFlavors.map(flavor => (
          <Card key={flavor.id} className="p-3 hover:shadow-md transition-shadow bg-accent">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: flavor.colorHex }} />
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <span className={`text-foreground break-words word-wrap-break-word overflow-wrap-anywhere`}>{flavor.name}</span>{' '}
                    <span className="text-gray-500 text-sm whitespace-nowrap">({t('user', { count: flavor.userCount })})</span>
                  </div>
                  <span className="text-sm font-bold text-foreground pt-1">{((flavor.userCount / totalUsers) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  ) : null
}
