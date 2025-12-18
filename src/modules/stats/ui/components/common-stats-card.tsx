import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Star, TrendingUp, Users, Wine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IOverallStats } from '../../entities/types'

interface CommonStatsCardProps {
  overallStats: IOverallStats
}

export const CommonStatsCard = ({ overallStats }: CommonStatsCardProps) => {
  const { t } = useTranslation('stats')
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0">
          <CardTitle className="text-sm font-medium">{t('total_grades')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className='pt-4 !pb-0'>
          <div className="text-2xl font-bold">{overallStats.totalRatings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{t('all_age_groups')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0">
          <CardTitle className="text-sm font-medium">{t('average_rating')}</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className='pt-4 !pb-0'>
          <div className="text-2xl font-bold">{overallStats.averageRating.toFixed(1)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3" />
            <span>{t('of_possible', { slug: 5 })}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0">
          <CardTitle className="text-sm font-medium">{t('most_active_group')}</CardTitle>
          <Wine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className='pt-4 !pb-0'>
          <div className="text-2xl font-bold">{overallStats.mostActive.ageGroup}</div>
          <p className="text-xs text-muted-foreground capitalize">
            {overallStats.mostActive.gender} • {t('grade', { count: overallStats.mostActive.count })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0">
          <CardTitle className="text-sm font-medium">{t('highest_rating')}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className='pt-4 !pb-0'>
          <div className="text-2xl font-bold">{overallStats.highestRating.rating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground capitalize">
            {overallStats.highestRating.ageGroup} • {overallStats.highestRating.gender}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
