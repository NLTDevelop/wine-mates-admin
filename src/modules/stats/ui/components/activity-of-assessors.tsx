import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { TabsContent } from '@/UIKit/shadcn/ui/tabs'
import { Mars, Venus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ActivityOfAssessorsProps {
  ageGroups: string[]
  aggregatedData: any
  selectedYear: string
  selectedGender?: 'male' | 'female' | 'all'
  years: number[]
}

const MAX_RATE = 5

export const ActivityOfAssessors = ({ ageGroups, aggregatedData, selectedYear, years, selectedGender }: ActivityOfAssessorsProps) => {
  const { t } = useTranslation('stats')

  if (Object.keys(aggregatedData).length === 0) {
    return (
      <TabsContent value="heatmap">
        <Card>
          <CardHeader className="border-b-0">
            <CardTitle className="text-foreground font-bold">{t('detailed_stats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">{t('no_data')}</p>
          </CardContent>
        </Card>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="heatmap">
      <Card>
        <CardHeader className="border-b-0 mb-2 pt-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-foreground font-bold">{t('summary_stats')}</CardTitle>
            <Badge className="text-sm text-input bg-accent-foreground/80">{selectedYear === 'all' ? t('data_of_years', { count: years.length }) : t('data_of_years', { slug: selectedYear })}</Badge>
          </div>
        </CardHeader>
        <CardContent className="!p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="text-sm font-medium text-center"></div>
                {ageGroups.map((group, idx) => (
                  <div key={`${group}-${idx}`} className="text-sm font-medium text-center">
                    {group} {t('years')}
                  </div>
                ))}
              </div>

              {selectedGender !== 'female' && (
                <div className="grid grid-cols-5 gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex gap-2 items-center font-medium">
                    <span>
                      <Mars />
                    </span>
                    <span>{t('male')}</span>
                  </div>
                  {ageGroups.map((ageGroup, idx) => {
                    const data = aggregatedData[`${selectedYear === 'all' ? years[0] : selectedYear}-male-${ageGroup}`]
                    if (!data)
                      return (
                        <div key={`${ageGroup}-${idx}`} className="text-center">
                          -
                        </div>
                      )

                    return (
                      <NLTTooltip
                        key={`${ageGroup}-${idx}`}
                        delay={500}
                        message={`${ageGroup} ${t('years')}: ${data.averageRating.toFixed(1)}/5 (${t('grade', { count: data.ratingsCount })})`}
                        className={'bg-blue-500/85  max-w-[300px]'}
                        trigger={
                          <div
                            className="text-center p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
                            style={{
                              backgroundColor: getHeatmapColor(data.averageRating, MAX_RATE),
                              color: data.averageRating > MAX_RATE ? 'white' : 'black',
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
              )}

              {selectedGender !== 'male' && (
                <div className="grid grid-cols-5 gap-2 p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                  <div className="flex gap-2 items-center font-medium">
                    <span>
                      <Venus />
                    </span>
                    <span>{t('female')}</span>
                  </div>
                  {ageGroups.map((ageGroup, idx) => {
                    const data = aggregatedData[`${selectedYear === 'all' ? years[0] : selectedYear}-female-${ageGroup}`]
                    if (!data)
                      return (
                        <div key={`${ageGroup}-${idx}`} className="text-center">
                          -
                        </div>
                      )

                    return (
                      <NLTTooltip
                        key={`${ageGroup}-${idx}`}
                        delay={500}
                        message={`${ageGroup} ${t('years')}: ${data.averageRating.toFixed(1)}/5 (${t('grade', { count: data.ratingsCount })})`}
                        className={'bg-pink-500/85  max-w-[300px]'}
                        trigger={
                          <div
                            className="text-center p-3 rounded-lg transition-all hover:scale-105 cursor-pointer"
                            style={{
                              backgroundColor: getHeatmapColor(data.averageRating, MAX_RATE),
                              color: data.averageRating > MAX_RATE ? 'white' : 'black',
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
              )}

              <div className="mt-6 mb-4 flex items-center justify-center space-x-4">
                <div className="flex h-4 w-48 rounded-full overflow-hidden">
                  {[...Array(MAX_RATE)].map((_, i) => (
                    <NLTTooltip
                      key={i}
                      delay={500}
                      message={`${t('rating')} ${i + 1}`}
                      className="max-w-[300px]"
                      trigger={
                        <div
                          className="flex-1"
                          style={{
                            backgroundColor: getHeatmapColor(i + 1, MAX_RATE),
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
