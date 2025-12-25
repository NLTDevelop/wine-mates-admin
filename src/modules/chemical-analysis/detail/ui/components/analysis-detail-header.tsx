import { useContrastText } from '@/hooks/ui/useContrastText'
import { IWineAnalysisDetail } from '../../entities/types'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Calendar, Grape, Wine } from 'lucide-react'

interface AnalysisDetailHeaderProps {
  analyzedWine: IWineAnalysisDetail
}
export const AnalysisDetailHeader = ({ analyzedWine }: AnalysisDetailHeaderProps) => {
  const { t } = useTranslation('analysis')

  const color = analyzedWine?.color?.colorHex ?? '#ffffff'
  const { textColorClass } = useContrastText(color)

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="relative sm:w-36 sm:h-36 w-full h-full overflow-hidden">
        {analyzedWine.image ? (
          <img src={analyzedWine.image.smallUrl || analyzedWine.image.mediumUrl} alt={analyzedWine.image.name || 'Image'} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-primary flex items-center justify-center rounded-lg"></div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{analyzedWine.name || t('unnamed_wine')}</h1>
            <div className="flex flex-wrap gap-2">
              {analyzedWine.color && (
                <Badge variant="secondary" className={textColorClass} style={{ backgroundColor: analyzedWine.color?.colorHex }}>
                  {analyzedWine.color.name}
                </Badge>
              )}
              {analyzedWine.typeName && <Badge className="bg-blue-50 text-foreground hover:bg-blue-50 cursor-default">{analyzedWine.typeName}</Badge>}
            </div>
          </div>
        </div>

        {analyzedWine.capacityName && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <Wine size={16} />
            {analyzedWine.capacityName}
          </p>
        )}
        {analyzedWine.grapeVariety && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <Grape size={16} />
            {analyzedWine.grapeVariety}
          </p>
        )}
        {analyzedWine.vintage && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            <Calendar size={16} />
            {analyzedWine.vintage}
          </p>
        )}
      </div>
    </div>
  )
}
