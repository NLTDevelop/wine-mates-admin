import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { StatsResponse } from '../../entities/types'
import { Mars, Venus } from 'lucide-react'
import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { useAgeGroupData } from '../../presenters/useAgeGroupData'

interface DistributionByAgeGroupsProps {
  selectedYear: string
  years: number[]
  ageGroups: string[]
  data: StatsResponse[]
}

export const DistributionByAgeGroups = ({ selectedYear, years, ageGroups, data }: DistributionByAgeGroupsProps) => {
  const { t } = useTranslation('stats')

  const allAgeGroupData = useAgeGroupData(data, selectedYear, ageGroups)

  return (
    <Card>
      <CardHeader className="pt-0 border-b-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground font-bold">{t('distribution_by_age')}</CardTitle>
          {data.length !== 0 && (
            <Badge className="text-sm text-input bg-accent-foreground/80">{selectedYear === 'all' ? t('data_of_years', { count: years.length }) : t('data_of_years', { slug: selectedYear })}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allAgeGroupData.map(({ ageGroup, maleData, femaleData, malePercent, femalePercent, totalRatings }) => (
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
                    message={`${t('female')}: ${t('grade', { count: femaleData.ratingsCount })} (${femalePercent}%), ${t('rating')}: ${femaleData.averageRating.toFixed(1)}`}
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
