import React from 'react'
import { Wine } from 'lucide-react'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { ImageModal } from '@/modals/imagesModal'
import { ImageSlider } from '@/UIKit/app-components/image-slider'
import { useContrastText } from '@/hooks/ui/useContrastText'

interface WineDetailHeaderProps {
  wine: IWines
}

export const WineDetailHeader: React.FC<WineDetailHeaderProps> = ({ wine }) => {
  const { t } = useTranslation('wines')
  const images = wine.images || []
  const hasImages = images.length > 0

  const color = wine.type ? wine.type?.colors[0].colorHex : '#ffffff'
  const { textColorClass } = useContrastText(color)

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-dashed border-muted-foreground">
      <div className="relative sm:w-32 sm:h-32 w-full h-full overflow-hidden">
        {hasImages ? (
          <ImageModal
            images={images}
            trigger={
              <button className="w-full h-full relative cursor-zoom-in">
                <ImageSlider images={images} className="w-full h-full" showControls={images.length > 1} showIndicators={false} />
              </button>
            }
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-primary flex items-center justify-center rounded-lg"></div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-foreground">{wine.displayName || t('unnamed_wine')}</h1>
          {wine.isConfirmed && (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              {t('confirmed')}
            </Badge>
          )}
        </div>

        {wine.producerName && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <Wine size={16} />
            {wine.producerName}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {wine.type && (
            <Badge className={textColorClass} style={{ backgroundColor: wine.type.colors[0].nameUa }}>
              {wine.type.nameUa}
            </Badge>
          )}
          {wine.classification && <Badge className="bg-amber-100 text-amber-900">{wine.classification}</Badge>}
          {wine.grapeVariety && (
            <Badge variant="secondary" className="bg-blue-50 text-foreground">
              {wine.grapeVariety}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
