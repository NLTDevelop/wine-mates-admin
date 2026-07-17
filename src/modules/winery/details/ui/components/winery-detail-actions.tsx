import React from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { WineriesType, WINERY_STATUS } from '@/modules/winery/list/entities/types'

interface WineryDetailActionsProps {
  onBack: () => void
  onConfirm: () => void
  onReject: () => void
  wineryStatus: WineriesType
}

export const WineryDetailActions: React.FC<WineryDetailActionsProps> = ({ onBack, onConfirm, onReject, wineryStatus }) => {
  const { t } = useTranslation('winery')

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:my-6 my-2 w-full justify-between">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-transparent">
        <ArrowLeft size={16} />
        {t('button.go_list')}
      </Button>

      {wineryStatus === WINERY_STATUS.REJECTED && (
        <Button onClick={onConfirm} className="flex items-center gap-2 w-full sm:w-auto">
          <CheckCircle size={16} />
          {t('button.confirm')}
        </Button>
      )}
      {wineryStatus === WINERY_STATUS.APPROVED && (
        <Button onClick={onReject} className="flex items-center gap-2 w-full sm:w-auto">
          <CheckCircle size={16} />
          {t('button.reject')}
        </Button>
      )}
      {wineryStatus === WINERY_STATUS.PENDING && (
        <div className="flex items-center gap-3">
          <Button onClick={onReject} className="flex items-center gap-2 w-full sm:w-auto">
            <CheckCircle size={16} />
            {t('button.reject')}
          </Button>
          <Button variant="delete" onClick={onConfirm} className="flex items-center gap-2 w-full sm:w-auto">
            {t('button.confirm')}
          </Button>
        </div>
      )}
    </div>
  )
}
