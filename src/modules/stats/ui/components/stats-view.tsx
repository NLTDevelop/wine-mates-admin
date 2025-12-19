import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/UIKit/shadcn/ui/tabs'
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { Selects } from './selects'
import { CommonStatsCard } from './common-stats-card'
import { DistributionByAgeGroups } from './distribution_by_age_groups'
import { TableStats } from './table-stats'
import { ActivityOfAssessors } from './activity-of-assessors'
import { useStats } from '../../presenters/useStats'

export function StatsView() {
  const { t } = useTranslation('stats')

  const {
    statsData,
    selectedYear,
    setSelectedYear,
    selectedGender,
    setSelectedGender,
    activeTab,
    setActiveTab,
    ageGroups,
    years,
    overallStats,
    aggregatedData,
    tableData,
    tableTotalCount,
    tableFilters,
    onChangePagination,
    resetAllFilters,
  } = useStats()

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
        <div className="w-auto mx-auto xl:w-4/5 pt-4">
          <Selects selectedYear={selectedYear} setSelectedYear={setSelectedYear} years={years} selectedGender={selectedGender} setSelectedGender={setSelectedGender} resetFilters={resetAllFilters} />
          <CommonStatsCard overallStats={overallStats} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto sm:grid-cols-3 grid-cols-1  my-6">
              <TabsTrigger value="heatmap">{t('summary_stats')}</TabsTrigger>
              <TabsTrigger value="overview">{t('activity_of_assessors')}</TabsTrigger>
              <TabsTrigger value="detailed">{t('detailed_table')}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <DistributionByAgeGroups selectedYear={selectedYear} years={years} ageGroups={ageGroups} data={statsData} />
            </TabsContent>
            <TabsContent value="heatmap">
              <ActivityOfAssessors ageGroups={ageGroups} aggregatedData={aggregatedData} selectedYear={selectedYear} years={years} selectedGender={selectedGender} />
            </TabsContent>
            <TabsContent value="detailed">
              <TableStats
                ageGroups={ageGroups}
                years={years}
                aggregatedData={tableData}
                selectedGender={selectedGender}
                selectedYear={selectedYear}
                totalCount={tableTotalCount}
                filters={tableFilters}
                onChangePagination={onChangePagination}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ContentLayout>
    </div>
  )
}
