import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAnalyzedWineDetail } from '../../presenters/useAnalyzedWineDetail'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { ContentLayout } from '@/layout/components/content-layout'
import { AnalysisDetailHeader } from './analysis-detail-header'
import { cn } from '@/lib/utils'
import { TastingContentView } from './taste-detail/tasting-content-view'
import { ChemicalAnalysisView } from './chemical-detail/chemical-analysis-view'
import { SelectDate } from './chemical-detail/select-date'
import { CharacteristicsCharts } from './chemical-detail/characteristics-charts'
import { SkeletonAnalysisView } from './skeleton-analysis-view'
import { ReviewsContent } from './reviews-content'

export const AnalysisDetailView = () => {
  const { t } = useTranslation('analysis')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { wine, sensory, selectedDate, chemical, charts, chartRange, setChartRange, setSelectedDate, availableDates, isLoading, reviews } = useAnalyzedWineDetail(id!)

  if (isLoading) {
    return <SkeletonAnalysisView />
  }

  if (!Object.keys(wine).length) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_wine')}</h2>
          <Button onClick={() => navigate('/analysis')}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  return (
    <ContentLayout title={t('analysis_detail')} handleGoBack={() => navigate(-1)} isGoBack>
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !isLoading ? 'fade-in' : '')}>
        <div className="space-y-6">
          <Card className="p-6">
            <AnalysisDetailHeader analyzedWine={wine} />

            <CardContent className="space-y-6">
              <TastingContentView analysisDates={availableDates} sensoryData={sensory} selectedDate={selectedDate} onDateChange={setSelectedDate} />
              <ChemicalAnalysisView currentSnapshot={chemical} />
              <SelectDate chartRange={chartRange} availableDates={availableDates} onChartRangeChange={setChartRange} onDateChange={setSelectedDate} selectedDate={selectedDate} />
              {charts && charts.graphs.length > 0 ? (
                <CharacteristicsCharts charts={charts} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('no_data')}</p>
                  <p className="text-sm text-gray-400 mt-2"> {t('chose_other_period')} </p>
                </div>
              )}
              <ReviewsContent reviews={reviews} />
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  )
}
