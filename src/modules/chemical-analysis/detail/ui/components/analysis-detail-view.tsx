import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAnalyzedWineDetail } from '../../presenters/useAnalyzedWineDetail'
import { useReviews } from '../../presenters/useReviews'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card } from '@/UIKit/shadcn/ui/card'
import { MessageSquare } from 'lucide-react'
import { AnalyzedWineDetailContent } from './analyzed-wine-detail-content'
import { ReviewsContent } from './reviews-content'
import { ContentLayout } from '@/layout/components/content-layout'
import { AnalysisDetailHeader } from './analysis-detail-header'
import { cn } from '@/lib/utils'

export const AnalysisDetailView = () => {
  const { t } = useTranslation('analysis')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { analyzedWine, currentSnapshot, sensoryAnalysis, chartData, selectedDate, availableDates, tabs, activeTab, setActiveTab, isLoading, chartRange, setChartRange, handleDateChange } =
    useAnalyzedWineDetail(id!)

  const { reviews } = useReviews()

  if (isLoading) {
    return <p>сделаю скелетон</p>
  }

  if (!analyzedWine) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_wine')}</h2>
          <Button onClick={() => navigate('/analysis')}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <AnalyzedWineDetailContent
            analyzedWine={analyzedWine}
            currentSnapshot={currentSnapshot}
            chartData={chartData}
            selectedDate={selectedDate}
            availableDates={availableDates}
            chartRange={chartRange}
            onDateChange={handleDateChange}
            onChartRangeChange={setChartRange}
            analysisDates={availableDates}
            sensoryData={sensoryAnalysis}
          />
        )

      case 'reviews':
        return (
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                <ReviewsContent />
              </div>
            ) : (
              <Card className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">{t('no_reviews') || 'No reviews yet'}</h4>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ContentLayout title={t('analysis_detail')} handleGoBack={() => navigate(-1)} isGoBack>
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !isLoading ? 'fade-in' : '')}>
        <div className="space-y-6">
          <Card className="p-6">
            <AnalysisDetailHeader analyzedWine={analyzedWine} />
          </Card>

          <div className="flex justify-center space-x-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all',
                  activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'reviews' && reviews?.length > 0 && (
                  <span className="inline-flex items-center justify-center h-4 min-w-4 p-1 pt-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">{reviews.length}</span>
                )}
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>
    </ContentLayout>
  )
}
