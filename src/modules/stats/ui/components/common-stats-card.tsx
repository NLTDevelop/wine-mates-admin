import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Star, TrendingUp, Users, Wine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IOverallStats } from '../../entities/types'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

interface CommonStatsCardProps {
  overallStats?: IOverallStats
  isLoading: boolean
}

export const CommonStatsCard = ({ overallStats, isLoading }: CommonStatsCardProps) => {
  const { t } = useTranslation('stats')

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
          <CardTitle className="text-sm font-medium">{t('total_grades')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4 !pb-0">
          {overallStats?.totalRatings ? (
            <>
              <div className="text-2xl font-bold">{overallStats.totalRatings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t('all_age_groups')}</p>
            </>
          ) : isLoading ? (
            <Skeleton className="h-12" />
          ) : (
            <p>{t('no_data')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
          <CardTitle className="text-sm font-medium">{t('average_rating')}</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4 !pb-0">
          {overallStats?.averageUserRating ? (
            <>
              <div className="text-2xl font-bold">{overallStats.averageUserRating.toFixed(1)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>{t('of_possible', { slug: 5 })}</span>
              </div>
            </>
          ) : isLoading ? (
            <Skeleton className="h-12" />
          ) : (
            <p>{t('no_data')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
          <CardTitle className="text-sm font-medium">{t('most_active_group')}</CardTitle>
          <Wine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4 !pb-0">
          {overallStats?.mostActiveGroup?.ratingsCount ? (
            <>
              <div className="text-2xl font-bold">{overallStats?.mostActiveGroup?.ageGroup}</div>
              <p className="text-xs text-muted-foreground capitalize">
                {overallStats?.mostActiveGroup?.gender} • {t('grade', { count: overallStats?.mostActiveGroup?.ratingsCount })}
              </p>
            </>
          ) : isLoading ? (
            <Skeleton className="h-12" />
          ) : (
            <p>{t('no_data')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
          <CardTitle className="text-sm font-medium">{t('highest_rating')}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4 !pb-0">
          {overallStats?.highestRatingGroup?.averageRating !== 0 && !isLoading ? (
            <>
              <div className="text-2xl font-bold">{overallStats?.highestRatingGroup?.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground capitalize">
                {overallStats?.highestRatingGroup?.ageGroup} • {overallStats?.highestRatingGroup?.gender}
              </p>
            </>
          ) : isLoading ? (
            <Skeleton className="h-12" />
          ) : (
            <p>{t('no_data')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
