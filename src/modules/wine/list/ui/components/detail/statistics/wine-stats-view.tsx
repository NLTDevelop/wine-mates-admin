import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ColorStats from './color-stats'
import AromaStats from './aroma-stats'
import { statistics } from '../mockStatictics'
import FlavorStats from './flavor-stats'
import TasteCharacteristicsStats from './taste-characteristics-stats'
import { useParams } from 'react-router-dom'

export const WineStatsView = () => {
  const { t } = useTranslation('wines')

  // const { id } = useParams<{ id: string }>()
  // const { wine, isLoading, refetch } = useWineDetail(id!)
  // const statistics = wine.stasistics

  const stats = statistics

  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <BarChart3 />
        {t('statistics')}
      </h3>
      <div className="space-y-6">
        <ColorStats topColor={stats.topColors} />
        <AromaStats topAromas={stats.topAromas} />
        <FlavorStats topFlavors={stats.topFlavors} />
        <TasteCharacteristicsStats tasteCharacteristics={statistics.tasteCharacteristics} />
      </div>
    </>
  )
}
