import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useWineDetail } from '../../presenters/useWineDetail'
import { useToast } from '@/hooks/shadcn/use-toast'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { SkeletonWineDetail, WineStatsView } from '..'
import { WineDetailHeader, WineDetailContent, WineDetailActions } from '..'
import { wineListService } from '../../entities/wine-list-service'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { useReviews } from '../../presenters/useReviews'
import { BarChart3, MessageSquare, Info } from 'lucide-react'
import { ReviewsSection } from './detail/reviews-section'
import { EditWineForm } from '@/modules/wine/create-taste/ui'

type TabType = 'details' | 'statistics' | 'reviews'

export const WineDetailView: React.FC = () => {
  const { t } = useTranslation('wines')
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const startEditing = params.get('edit') === 'true'
  const [isEditing, setIsEditing] = useState(startEditing)
  const [activeTab, setActiveTab] = useState<TabType>('details')

  const { wine, isLoading, refetch } = useWineDetail(id!)
  const { reviews } = useReviews(id!)

  const tabs = [
    { id: 'details' as TabType, label: t('wine_detail'), icon: <Info className="h-4 w-4" /> },
    { id: 'statistics' as TabType, label: t('statistics'), icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'reviews' as TabType, label: t('reviews'), icon: <MessageSquare className="h-4 w-4" /> },
  ]

  const handleConfirmWine = async (isConfirmed: boolean) => {
    try {
      await wineListService.confirm({ id: id!, isConfirmed })
      toast({
        title: isConfirmed ? t('confirm_wine_msg') : t('unconfirm_wine_msg'),
        variant: 'default',
      })
      refetch()
    } catch (error) {
      toast({
        title: t('err_confirm_wine_msg'),
        variant: 'destructive',
      })
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    refetch()
    navigate(`/wines/${id}`, { replace: true })
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    navigate(`/wines/${id}`, { replace: true })
  }

  const handleVintageChange = (newWineId: string) => {
    navigate(`/wines/${newWineId}`, { replace: true })
    refetch()
  }

  if (isLoading) {
    return <SkeletonWineDetail />
  }

  if (!wine) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_wine')}</h2>
          <Button onClick={() => navigate('/wines')}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <WineDetailContent wine={wine} onVintageChange={handleVintageChange} />

      case 'statistics':
        return <WineStatsView />

      case 'reviews':
        return (
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                <ReviewsSection wineId={id} />
              </div>
            ) : (
              <Card className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">{t('no_reviews')}</h4>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ContentLayout
      title={isEditing ? t('edit_wine') : t('wine_detail')}
      btn={<WineDetailActions onBack={() => navigate(-1)} onConfirmWine={handleConfirmWine} wine={wine} onEdit={() => setIsEditing(true)} isEditing={isEditing} />}
      isGoBack
    >
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !isLoading ? 'fade-in' : '')}>
        {isEditing ? (
          <EditWineForm wine={wine} onSuccess={handleEditSuccess} onCancel={handleEditCancel} />
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <WineDetailHeader wine={wine} />
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
                  {tab.id === 'reviews' && reviews && reviews?.length > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 p-1 pt-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">{reviews.length}</span>
                  )}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>
        )}
      </div>
    </ContentLayout>
  )
}
