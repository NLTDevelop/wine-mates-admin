import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Button } from '@/UIKit/shadcn/ui/button'
import { ContentLayout } from '@/layout/components/content-layout'
import { cn } from '@/lib/utils'
import { SkeletonWineDetail } from '@/modules/wine/list/ui'
import { useWineryDetail } from '../../presenters/useWineryDetail'
import { ConfirmModal } from '@/modals/confirmModal'
import { WINERY_STATUS } from '@/modules/winery/list/entities/types'
import { useCallback } from 'react'
import { WineryDetailActions } from './winery-detail-actions'
import { WineryDetailHeader } from './winery-detail-header'
import { WineOfWinery } from './wine-of-winery'

export const WineryDetailView: React.FC = () => {
  const { t } = useTranslation('winery')
  const { id } = useParams<{ id: string }>()

  const { winery, isLoading, handleBack, confirmWinery, rejectWinery, confirmModal, wineryToConfirm } = useWineryDetail(id!)

  const modalActionTitle = wineryToConfirm.status === WINERY_STATUS.APPROVED ? t('modal.cancel_action') : t('modal.confirm_action')

  const modalMessage =
    wineryToConfirm.status === WINERY_STATUS.APPROVED ? t('modal.cancel_actions', { slug: wineryToConfirm.wineryName }) : t('modal.confirm_actions', { slug: wineryToConfirm.wineryName })

  const handleConfirm = useCallback(() => {
    confirmModal.open(id!)
  }, [confirmModal, id])

  const handleReject = useCallback(() => {
    confirmModal.open(id!)
  }, [confirmModal, id])

  const handleConfirmAction = useCallback(
    (rejectionReason?: string) => {
      if (!wineryToConfirm) return

      const isApproved = wineryToConfirm?.status === WINERY_STATUS.APPROVED

      if (isApproved) {
        rejectWinery(rejectionReason)
      } else {
        confirmWinery()
      }
    },
    [wineryToConfirm.status, confirmWinery, rejectWinery]
  )

  if (isLoading) {
    return <SkeletonWineDetail />
  }

  if (!winery) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('no_winery')}</h2>
          <Button onClick={handleBack}>{t('go_list')}</Button>
        </div>
      </div>
    )
  }

  return (
    <ContentLayout title={t('winery_detail')} btn={<WineryDetailActions onBack={handleBack} onConfirm={handleConfirm} onReject={handleReject} wineryStatus={winery.application.status} />} isGoBack>
      <div className={cn('mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl', !isLoading ? 'fade-in' : '')}>
        <div className="space-y-6">
          <Card className="p-6">
            <WineryDetailHeader winery={winery} />
          </Card>

          <div className="flex justify-center space-x-1 mb-6"></div>
          <WineOfWinery wineryId={id!} />
        </div>
      </div>
      <ConfirmModal
        title={t('modal.confirm_title')}
        actionTitle={modalActionTitle}
        variant="submit"
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.close}
        onSubmit={handleConfirmAction}
        showRejectionReason={wineryToConfirm.status === WINERY_STATUS.APPROVED}
      >
        <div className="p-px">
          <p>{modalMessage}</p>
        </div>
      </ConfirmModal>
    </ContentLayout>
  )
}
