import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ColorStats from './color-stats'
import AromaStats from './aroma-stats'
import FlavorStats from './flavor-stats'
import TasteCharacteristicsStats from './taste-characteristics-stats'
import { useParams } from 'react-router-dom'
import { useWineDetail } from '@/modules/wine/list/presenters/useWineDetail'
import { Card } from '@/UIKit/shadcn/ui/card'

export const WineStatsView = () => {
  const { t } = useTranslation('wines')

  const { id } = useParams<{ id: string }>()
  const { wine, isEmptyData } = useWineDetail(id!)

  const stats = wine?.statistics

  if (isEmptyData) {
    return (
      <Card className="text-center py-12">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h4 className="text-lg font-medium text-gray-700 mb-2">{t('no_data')}</h4>
      </Card>
    )
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <BarChart3 />
        {t('statistics')}
      </h3>
      <div className="space-y-6">
        <ColorStats topColor={stats?.topColor ?? []} />
        <AromaStats topAromas={stats?.topAromas ?? []} />
        <FlavorStats topFlavors={stats?.topFlavors ?? []} />
        <TasteCharacteristicsStats tasteCharacteristics={stats?.tasteCharacteristics ?? []} />
      </div>
    </>
  )
}
