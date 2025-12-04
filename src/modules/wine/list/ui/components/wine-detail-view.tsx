import React, { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useWineDetail } from '../../presenters/useWineDetail'
import { useToast } from '@/hooks/shadcn/use-toast'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { SkeletonWineDetail } from '..'
import { WineDetailHeader, WineDetailContent, WineDetailActions } from '..'
import { wineListService } from '../../entities/wine-list-service'
import { EditWineForm } from '@/modules/wine/create/wine/ui/components/edit-wine-form'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'

export const WineDetailView: React.FC = () => {
  const { t } = useTranslation('wines')
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()

  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const startEditing = params.get('edit') === 'true'
  const [isEditing, setIsEditing] = useState(startEditing)

  const { wine, isLoading, refetch } = useWineDetail(id!)

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
    <ContentLayout
      title={isEditing ? t('edit_wine') : t('wine_detail')}
      btn={<WineDetailActions onBack={() => navigate(-1)} onConfirmWine={handleConfirmWine} wine={wine} onEdit={() => setIsEditing(true)} isEditing={isEditing} />}
      isGoBack
    >
      <div className={cn("mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl", !isLoading ? "fade-in" : "")}>
        {isEditing ? (
          <EditWineForm wine={wine}  onSuccess={handleEditSuccess} onCancel={handleEditCancel} />
        ) : (
          <Card className="p-6">
            <WineDetailHeader wine={wine} />
            <WineDetailContent wine={wine} />
          </Card>
        )}
      </div>
    </ContentLayout>
  )
}
