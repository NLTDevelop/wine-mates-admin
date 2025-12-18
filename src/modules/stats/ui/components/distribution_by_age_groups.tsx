import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { YearData } from '../../entities/types'
import { Mars, Venus } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'

interface DistributionByAgeGroupsProps {
  selectedYear: string
  years: number[]
  ageGroups: string[]
  data: YearData[]
}

export const DistributionByAgeGroups = ({ selectedYear, years, ageGroups, data }: DistributionByAgeGroupsProps) => {
  const { t } = useTranslation('stats')
  return (
    <Card>
      <CardHeader className="border-b-0">
        <div className="flex justify-between items-center">
          <CardTitle>{t('distribution_by_age')}</CardTitle>
          <Badge className="text-sm text-input bg-accent-foreground/80">{selectedYear === 'all' ? t('data_of_years', { count: years.length }) : t('data_of_years', { slug: selectedYear })}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ageGroups.map(ageGroup => {
            let maleData = null
            let femaleData = null

            if (selectedYear === 'all') {
              const allMaleRatings = data.map(d => d.data.male[ageGroup]).filter(Boolean)
              const allFemaleRatings = data.map(d => d.data.female[ageGroup]).filter(Boolean)

              if (allMaleRatings.length > 0) {
                maleData = {
                  ratingsCount: allMaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
                  averageRating: allMaleRatings.reduce((sum, item) => sum + item.averageRating * item.ratingsCount, 0) / allMaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
                }
              }

              if (allFemaleRatings.length > 0) {
                femaleData = {
                  ratingsCount: allFemaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
                  averageRating: allFemaleRatings.reduce((sum, item) => sum + item.averageRating * item.ratingsCount, 0) / allFemaleRatings.reduce((sum, item) => sum + item.ratingsCount, 0),
                }
              }
            } else {
              const yearData = data.find(d => d.year === parseInt(selectedYear))
              maleData = yearData?.data.male[ageGroup] || null
              femaleData = yearData?.data.female[ageGroup] || null
            }

            const totalRatings = (maleData?.ratingsCount || 0) + (femaleData?.ratingsCount || 0)

            const malePercent = totalRatings > 0 ? (((maleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'
            const femalePercent = totalRatings > 0 ? (((femaleData?.ratingsCount || 0) / totalRatings) * 100).toFixed(1) : '0'

            return (
              <div key={ageGroup} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {ageGroup} {t('years')}
                  </span>
                </div>

                <div className="relative h-6 rounded-full overflow-hidden bg-muted">
                  {maleData && maleData.ratingsCount > 0 && (
                    <NLTTooltip
                      delay={500}
                      message={`${t('male')}: ${t('grade', { count: maleData.ratingsCount })} (${malePercent}%), ${t('rating')}: ${maleData.averageRating.toFixed(1)}`}
                      className={'bg-blue-500/85  max-w-[300px]'}
                      trigger={
                        <div
                          className="absolute h-full bg-blue-500 transition-all duration-300 flex items-center justify-start pl-2 "
                          style={{
                            width: `${malePercent}%`,
                            left: 0,
                          }}
                        >
                          {parseFloat(malePercent) > 9 && (
                            <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                              <Mars className="h-5 w-5" />
                              <span>{malePercent}%</span>
                            </div>
                          )}
                        </div>
                      }
                    />
                  )}

                  {femaleData && femaleData.ratingsCount > 0 && (
                    <NLTTooltip
                      delay={500}
                      message={`${t('female')}: ${t('grade', { count: femaleData.ratingsCount })} (${malePercent}%), ${t('rating')}: ${femaleData.averageRating.toFixed(1)}`}
                      className={'bg-pink-500/85  max-w-[300px]'}
                      trigger={
                        <div
                          className="absolute h-full bg-pink-500 transition-all duration-300 flex items-center justify-end pr-2 "
                          style={{
                            width: `${femalePercent}%`,
                            left: `${malePercent}%`,
                          }}
                        >
                          {parseFloat(femalePercent) > 9 && (
                            <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                              <span>{femalePercent}%</span>
                              <Venus className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      }
                    />
                  )}

                  {totalRatings === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{t('no_data')}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
