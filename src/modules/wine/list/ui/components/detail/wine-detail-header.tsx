import React from 'react'
import { Wine } from 'lucide-react'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'

interface WineDetailHeaderProps {
  wine: IWines
}

export const WineDetailHeader: React.FC<WineDetailHeaderProps> = ({ wine }) => {
  const { t } = useTranslation('wines')

  const color = wine?.color?.colorHex ?? '#ffffff'
  const { textColorClass } = useContrastText(color)

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-dashed border-muted-foreground">
      <div className="relative sm:w-32 sm:h-32 w-full h-full overflow-hidden">
        {wine.image ? (
          <img src={wine.image.smallUrl || wine.image.mediumUrl} alt={wine.image.name || 'Image'} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-primary flex items-center justify-center rounded-lg"></div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-foreground">{wine.name || t('unnamed_wine')}</h1>
          {wine.isConfirmed && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              {t('confirmed')}
            </Badge>
          )}
        </div>

        {wine.producer && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <Wine size={16} />
            {wine.producer}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {wine.color && (
            <Badge variant="secondary" className={textColorClass} style={{ backgroundColor: wine.color?.colorHex }}>
              {wine.color.name}
            </Badge>
          )}
          {wine.type?.name && <Badge className="bg-blue-50 text-foreground hover:bg-blue-50 cursor-default">{wine.type.name}</Badge>}
        </div>
      </div>
    </div>
  )
}
