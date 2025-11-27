import React from 'react'
import { ArrowLeft, CheckCircle, Edit, XCircle } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'
import { IWines } from '../../../entities/types/types'

interface WineDetailActionsProps {
  onBack: () => void
  onConfirmWine: (isConfirmed: boolean) => void
  onEdit: () => void
  wine: IWines
  isEditing?: boolean
}

export const WineDetailActions: React.FC<WineDetailActionsProps> = ({ onBack, onConfirmWine, wine, onEdit, isEditing }) => {
  const { t } = useTranslation('wines')

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:my-6 my-2 w-full justify-between">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2 hover:bg-transparent">
        <ArrowLeft size={16} />
        {t('go_list')}
      </Button>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {!isEditing && (
          <Button onClick={onEdit} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Edit size={16} />
            {t('button.edit')}
          </Button>
        )}
        {!wine.isConfirmed ? (
          <Button onClick={() => onConfirmWine(true)} className="flex items-center gap-2 w-full sm:w-auto">
            <CheckCircle size={16} />
            {t('button.confirm')}
          </Button>
        ) : (
          <Button variant="delete" onClick={() => onConfirmWine(false)} className="flex items-center gap-2 w-full sm:w-auto" disabled={isEditing}>
            <XCircle size={16} />
            {t('unconfirm_wine')}
          </Button>
        )}
      </div>
    </div>
  )
}
