import { Card } from '@/UIKit/shadcn/ui/card'
import { Droplet, Flower } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TopAroma } from '../../../../entities/types/statistics-types'

interface AromaStatsProps {
  topAromas: TopAroma[]
  height?: number
  showLegend?: boolean
}

export default function AromaStats({ topAromas, height = 12, showLegend = true }: AromaStatsProps) {
  const { t } = useTranslation('rate')
  const { t: tw } = useTranslation('wines')

  const totalUsers = useMemo(() => topAromas.reduce((sum, t) => sum + t.userCount, 0), [topAromas])
  const sortedTop = [...topAromas].sort((a, b) => a.userCount - b.userCount).reverse()

  return totalUsers > 0 ? (
    <Card className="w-full space-y-3 mt-4">
      <h2 className="text-lg font-bold flex gap-2 items-center">
        <Flower size={20} />
        {tw('smells')}
      </h2>
      <div className="w-full overflow-hidden rounded-full bg-muted flex" style={{ height }}>
        {sortedTop.map(top => {
          const percent = (top.userCount / totalUsers) * 100
          return (
            <div key={top.id} title={`${top.name}: ${top.userCount} (${percent.toFixed(1)}%)`} style={{ width: `${percent}%`, backgroundColor: top.colorHex }} className="px-1 h-full transition-all" />
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sortedTop.map((top, idx) => {
          const totalSubgroupsInThisGroup = useMemo(() => top.subgroups?.reduce((sum, sub) => sum + (sub.userCount || 0), 0) || 0, [top.subgroups])

          return (
            <Card key={top.id} className="space-y-2 !w-full min-w-0 bg-accent">
              <div className="flex items-start gap-2 min-w-0  w-full">
                <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: top.colorHex }} />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <span className={`text-foreground ${idx === 0 && 'font-bold'}  break-words word-wrap-break-word overflow-wrap-anywhere`}>{top.name} </span>
                      <span className="text-gray-500 text-sm whitespace-nowrap">({t('user', { count: top.userCount })})</span>
                    </div>
                    <span className="text-sm font-bold text-foreground pt-1">{((top.userCount / totalUsers) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {totalSubgroupsInThisGroup > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Droplet size={14} />
                    <span>{tw('flavors.flavor_shades')}:</span>
                  </div>
                  <div className=" flex w-full overflow-hidden rounded-full bg-muted" style={{ height: height - 4 }}>
                    {top.subgroups
                      .filter(sub => sub.userCount > 0)
                      .reverse()
                      .map(sub => {
                        const subPercent = (sub.userCount / totalSubgroupsInThisGroup) * 100
                        return (
                          <div
                            key={sub.id}
                            title={`${sub.name}: ${sub.userCount} (${subPercent.toFixed(0)}%)`}
                            style={{ width: `${subPercent}%`, backgroundColor: sub.colorHex }}
                            className="h-full transition-all"
                          />
                        )
                      })}
                  </div>
                </div>
              )}
              {top.subgroups
                .filter(sub => sub.userCount > 0)
                .reverse()
                .map((sub, i) => (
                  <div key={sub.id} className="space-y-1 p-2 bg-gray-50 rounded">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: sub.colorHex }} />
                      <span className={`text-sm  ${i === 0 && 'font-bold'} text-foreground break-words word-wrap-break-word overflow-wrap-anywhere `}>{sub.name}</span>
                      <span className="text-gray-500 text-sm whitespace-nowrap">({t('user', { count: sub.userCount })})</span>
                    </div>
                    {showLegend && sub.aromas.filter(a => a.userCount > 0).length > 0 && (
                      <div className="text-sm mt-1">
                        {sub.aromas
                          .filter(a => a.userCount > 0)
                          .reverse()
                          .map(a => (
                            <div key={a.id} className="pl-8 mb-1 ">
                              <div className="flex flex-wrap items-start gap-1 w-full rounded bg-input/60 p-2 overflow-hidden">
                                <span className="text-sm   text-foreground break-words word-wrap-break-word overflow-wrap-anywhere min-w-0 flex-1">{a.name}</span>
                                <span className="text-sm text-gray-500 ml-1">({t('user', { count: a.userCount })})</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </Card>
          )
        })}
      </div>
    </Card>
  ) : null
}
