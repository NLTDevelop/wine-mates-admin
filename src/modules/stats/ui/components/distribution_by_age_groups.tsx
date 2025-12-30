import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { GenderData } from '../../entities/types'
import { useAgeGroupData } from '../../presenters/useAgeGroupData'
import { AgeGroupBar } from './age-group-bar'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

interface DistributionByAgeGroupsProps {
  selectedYear: string
  years: number[]
  ageGroups: string[]
  data?: GenderData
  genderFilter?: 'male' | 'female' | 'all'
  isLoading: boolean
}

export const DistributionByAgeGroups = ({ selectedYear, years, ageGroups, data, genderFilter = 'all', isLoading = false }: DistributionByAgeGroupsProps) => {
  const { t } = useTranslation('stats')

  const allAgeGroupData = useAgeGroupData(ageGroups, genderFilter, data)

  const hasData = allAgeGroupData.some(item => item.totalRatings > 0)

  return (
    <Card>
      <CardHeader className="pt-0 border-b-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground font-bold">
            {t('distribution_by_age')}
            {!isLoading && genderFilter !== 'all' && <span className="ml-2 text-sm font-normal text-muted-foreground">({genderFilter === 'male' ? t('male_only') : t('female_only')})</span>}
          </CardTitle>
          {!isLoading && hasData && (
            <Badge className="text-sm text-input bg-accent-foreground/80">{selectedYear === 'all' ? t('data_of_years', { count: years.length }) : t('data_of_year', { year: selectedYear })}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-6 w-full rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-6 w-full rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-6 w-full rounded-full" />
              </div>
            </>
          ) : allAgeGroupData.length > 0 && hasData ? (
            allAgeGroupData.map(item => <AgeGroupBar key={item.ageGroup} item={item} genderFilter={genderFilter} />)
          ) : (
            <div className="text-center py-8">
              <span className="text-muted-foreground">{t('no_data_available')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
