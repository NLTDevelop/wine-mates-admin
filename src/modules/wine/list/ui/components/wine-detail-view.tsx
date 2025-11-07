import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWineDetail } from '../../presenters/useWineDetail'
import { useToast } from '@/hooks/shadcn/use-toast'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { SkeletonWineDetail } from '..'
import { WineDetailHeader, WineDetailContent, WineDetailActions } from '..'
import { wineListService } from '../../entities/wine-list-service'
import { mockWines } from '../../entities/mock'

export const WineDetailView: React.FC = () => {
  const { t } = useTranslation('wines')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const wine = mockWines[0]
  const { /*wine,*/ isLoading, refetch } = useWineDetail(id!)

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

  return (
    <div className="mx-auto px-4 py-6 max-w-4xl">
      <WineDetailActions onBack={() => navigate('/wines')} onConfirmWine={handleConfirmWine} wine={wine} />

      <Card className="p-6">
        <WineDetailHeader wine={wine} />
        <WineDetailContent wine={wine} />
      </Card>
    </div>
  )
}
