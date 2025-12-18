import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { TabsContent } from '@/UIKit/shadcn/ui/tabs'
import { Mars, Venus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ActivityOfAssessorsProps {
  ageGroups: string[]
  aggregatedData: any
  selectedYear: string
  years: number[]
}

export const ActivityOfAssessors = ({ ageGroups, aggregatedData, selectedYear, years }: ActivityOfAssessorsProps) => {
  const { t } = useTranslation('stats')

  return (
    <TabsContent value="heatmap">
      <Card >
        <CardContent className='!p-0'>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="text-sm font-medium text-center"></div>
                {ageGroups.map(group => (
                  <div key={group} className="text-sm font-medium text-center">
                    {group} {t('years')}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex gap-2 items-center font-medium">
                  <span>
                    <Mars />
                  </span>
                  <span>{t('male')}</span>
                </div>
                {ageGroups.map(ageGroup => {
                  const data = aggregatedData[`${selectedYear === 'all' ? years[0] : selectedYear}-male-${ageGroup}`]
                  if (!data)
                    return (
                      <div key={ageGroup} className="text-center">
                        -
                      </div>
                    )

                  return (
                    <NLTTooltip
                      key={ageGroup}
                      delay={500}
                      message={`${ageGroup} ${t('years')}: ${data.averageRating.toFixed(1)}/5 (${t('grade', { count: data.ratingsCount })})`}
                      className={'bg-blue-500/85  max-w-[300px]'}
                      trigger={
                        <div
                          className="text-center p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
                          style={{
                            backgroundColor: getHeatmapColor(data.averageRating, 10),
                            color: data.averageRating > 5 ? 'white' : 'black',
                          }}
                        >
                          <div className="text-lg font-bold">{data.averageRating.toFixed(1)}</div>
                          <div className="text-xs opacity-95">
                            {data.ratingsCount} {t('grades')}
                          </div>
                        </div>
                      }
                    />
                  )
                })}
              </div>

              <div className="grid grid-cols-5 gap-2 p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                <div className="flex gap-2 items-center font-medium">
                  <span>
                    <Venus />
                  </span>
                  <span>{t('female')}</span>
                </div>
                {ageGroups.map(ageGroup => {
                  const data = aggregatedData[`${selectedYear === 'all' ? years[0] : selectedYear}-female-${ageGroup}`]
                  if (!data)
                    return (
                      <div key={ageGroup} className="text-center">
                        -
                      </div>
                    )

                  return (
                    <NLTTooltip
                      delay={500}
                      message={`${ageGroup} ${t('years')}: ${data.averageRating.toFixed(1)}/5 (${t('grade', { count: data.ratingsCount })})`}
                      className={'bg-pink-500/85  max-w-[300px]'}
                      trigger={
                        <div
                          key={ageGroup}
                          className="text-center p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
                          style={{
                            backgroundColor: getHeatmapColor(data.averageRating, 10),
                            color: data.averageRating > 5 ? 'white' : 'black',
                          }}
                        >
                          <div className="text-lg font-bold">{data.averageRating.toFixed(1)}</div>
                          <div className="text-xs opacity-90">
                            {data.ratingsCount} {t('grades')}
                          </div>
                        </div>
                      }
                    />
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex h-4 w-48 rounded-full overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <NLTTooltip
                      delay={500}
                      message={`${t('rating')} ${i + 1}`}
                      className="max-w-[300px]"
                      trigger={
                        <div
                          key={i}
                          className="flex-1"
                          style={{
                            backgroundColor: getHeatmapColor(i + 1, 5),
                          }}
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

const getHeatmapColor = (value: number, max: number) => {
  const intensity = value / max
  const hue = 120 * (1 - intensity)
  return `hsl(${hue}, 70%, 50%)`
}
