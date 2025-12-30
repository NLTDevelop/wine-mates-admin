import { Activity, Droplets, Flame, FlaskConical, Layers, Wind } from 'lucide-react'
import { ChemicalIndicatorCard } from './chemical-indicator-card'
import { AdditionIndicatorCard } from './addition-indicator-card'
import { useTranslation } from 'react-i18next'
import { ISnapshot } from '../analyzed-wine-detail-content'

interface ChemicalAnalysisViewProps {
  currentSnapshot: ISnapshot
}

export const ChemicalAnalysisView = ({ currentSnapshot }: ChemicalAnalysisViewProps) => {
  const { t } = useTranslation('analysis')
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <FlaskConical className="h-5 w-5" />
        {t('chemical_analysis')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <ChemicalIndicatorCard
          title={t('sugar')}
          value={currentSnapshot.sugarContent[0]?.value || 0}
          unit={t('measure')}
          date={currentSnapshot.sugarContent[0]?.date}
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
        />
        <ChemicalIndicatorCard title="pH" value={currentSnapshot.ph[0]?.value || 0} unit="pH" date={currentSnapshot.ph[0]?.date} icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
        <ChemicalIndicatorCard
          title={t('alcohol')}
          value={currentSnapshot.alcohol[0]?.value || 0}
          unit="%"
          date={currentSnapshot.alcohol[0]?.date}
          icon={<Flame className="h-4 w-4 text-muted-foreground" />}
        />
        <ChemicalIndicatorCard
          title={t('volatile_acidity')}
          value={currentSnapshot.volatileAcidity[0]?.value || 0}
          unit={t('measure')}
          date={currentSnapshot.volatileAcidity[0]?.date}
          icon={<Wind className="h-6 w-6 text-muted-foreground" />}
        />
        <ChemicalIndicatorCard
          title={t('total_acidity')}
          value={currentSnapshot.totalAcidity[0]?.value || 0}
          unit={t('measure')}
          date={currentSnapshot.totalAcidity[0]?.date}
          icon={<Layers className="h-6 w-6 text-muted-foreground" />}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
        <AdditionIndicatorCard title={`${t('free')} SO₂`} value={currentSnapshot.freeSO2} unit={t('measure2')} />
        <AdditionIndicatorCard title={`${t('total')} SO₂`} value={currentSnapshot.totalSO2} unit={t('measure2')} />
        <AdditionIndicatorCard title={t('density')} value={currentSnapshot.density} unit={t('measure3')} />
        <AdditionIndicatorCard title={t('malolactic')} value={currentSnapshot.malolactic ? t('done') : t('not_done')} />
        <AdditionIndicatorCard title={t('fermentationTemp')} value={currentSnapshot.fermentationTemp} unit="°C" />
      </div>
    </>
  )
}
