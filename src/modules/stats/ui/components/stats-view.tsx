import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { Selects } from './selects'
import { CommonStatsCard } from './common-stats-card'
import { DistributionByAgeGroups } from './distribution_by_age_groups'
import { TableStats } from './table-stats'
import { ActivityOfAssessors } from './activity-of-assessors'
import { useStatsData } from '../../presenters/useStatsData'
import { YearData } from '../../entities/types'

const mockData = [
  {
    year: 2025,
    data: {
      male: {
        '18-25': { ratingsCount: 150, averageRating: 4.2 },
        '25-45': { ratingsCount: 320, averageRating: 3.8 },
        '46-60': { ratingsCount: 210, averageRating: 2.5 },
        '60+': { ratingsCount: 95, averageRating: 1.9 },
      },
      female: {
        '18-25': { ratingsCount: 180, averageRating: 0.5 },
        '25-45': { ratingsCount: 290, averageRating: 4.1 },
        '46-60': { ratingsCount: 170, averageRating: 4.7 },
        '60+': { ratingsCount: 80, averageRating: 5.0 },
      },
    },
  },
  {
    year: 2024,
    data: {
      male: {
        '18-25': { ratingsCount: 130, averageRating: 4.9 },
        '25-45': { ratingsCount: 300, averageRating: 3.6 },
        '46-60': { ratingsCount: 190, averageRating: 3.3 },
        '60+': { ratingsCount: 85, averageRating: 4.7 },
      },
      female: {
        '18-25': { ratingsCount: 160, averageRating: 4.3 },
        '25-45': { ratingsCount: 270, averageRating: 2.9 },
        '46-60': { ratingsCount: 150, averageRating: 4.5 },
        '60+': { ratingsCount: 75, averageRating: 4.9 },
      },
    },
  },
]
interface StatsViewProps {
  data: YearData[]
}

export function StatsView({ data = mockData }: StatsViewProps) {
  const { t } = useTranslation('stats')

  const { selectedYear, setSelectedYear, selectedGender, setSelectedGender, activeTab, setActiveTab, ageGroups, years, overallStats, aggregatedData } = useStatsData(data)

  const renderDescription = () => (
    <>
      <p>{t('grade_stats_description')}</p>
      {selectedYear === 'all' ? (
        <p className="text-sm text-muted-foreground">
          {t('data_of_years', { count: years.length })}: {years.sort().join(', ')}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{t('data_of_current_year')}</p>
      )}
    </>
  )

  return (
    <div className="space-y-6 ">
      <ContentLayout title={t('grade_stats')} description={renderDescription()}>
        <div className="w-auto mx-auto lg:w-4/5 pt-4">
          <Selects selectedYear={selectedYear} setSelectedYear={setSelectedYear} years={years} selectedGender={selectedGender} setSelectedGender={setSelectedGender} />
          <CommonStatsCard overallStats={overallStats} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3  my-6">
              <TabsTrigger value="overview">{t('summary_stats')}</TabsTrigger>
              <TabsTrigger value="heatmap">{t('activity_of_assessors')}</TabsTrigger>
              <TabsTrigger value="detailed">{t('detailed_table')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <DistributionByAgeGroups selectedYear={selectedYear} years={years} ageGroups={ageGroups} data={data} />
            </TabsContent>
            <TabsContent value="heatmap">
              <ActivityOfAssessors ageGroups={ageGroups} aggregatedData={aggregatedData} selectedYear={selectedYear} years={years} />
            </TabsContent>
            <TabsContent value="detailed">
              <TableStats ageGroups={ageGroups} years={years} aggregatedData={aggregatedData} selectedGender={selectedGender} selectedYear={selectedYear} />
            </TabsContent>
          </Tabs>
        </div>
      </ContentLayout>
    </div>
  )
}
