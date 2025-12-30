import { NLTTooltip } from '@/UIKit/components/NLTTooltip'
import { Mars, Venus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const AgeGroupBar = ({ item, genderFilter }: { item: any; genderFilter: 'male' | 'female' | 'all' }) => {
  const { t } = useTranslation('stats')
  const { ageGroup, maleData, femaleData, malePercent, femalePercent, totalRatings, mode } = item

  return (
    <div key={ageGroup} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          {ageGroup} {t('years')}
        </span>
        {mode === 'single' && maleData && maleData.ratingsCount > 0 && <span className="text-xs text-muted-foreground">{malePercent}%</span>}
        {mode === 'single' && femaleData && femaleData.ratingsCount > 0 && <span className="text-xs text-muted-foreground">{femalePercent}%</span>}
      </div>

      <div className="relative h-6 rounded-full overflow-hidden bg-muted">
        {genderFilter === 'all' && (
          <>
            {maleData && maleData.ratingsCount > 0 && (
              <NLTTooltip
                delay={500}
                message={`${t('male')}: ${t('grade', { count: maleData.ratingsCount })} (${malePercent}%), ${t('rating')}: ${maleData.averageRating.toFixed(1)}`}
                className={'bg-blue-500/85 max-w-[300px]'}
                trigger={
                  <div
                    className="absolute h-full bg-blue-500 transition-all duration-300 flex items-center justify-start pl-2"
                    style={{
                      width: `${malePercent}%`,
                      left: 0,
                    }}
                  >
                    {parseFloat(malePercent) > 5 && (
                      <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                        <Mars className="h-5 w-5" />
                        <span>{malePercent}%</span>
                      </div>
                    )}
                  </div>
                }
              />
            )}

            {femaleData && femaleData.ratingsCount > 0 && (
              <NLTTooltip
                delay={500}
                message={`${t('female')}: ${t('grade', { count: femaleData.ratingsCount })} (${femalePercent}%), ${t('rating')}: ${femaleData.averageRating.toFixed(1)}`}
                className={'bg-pink-500/85 max-w-[300px]'}
                trigger={
                  <div
                    className="absolute h-full bg-pink-500 transition-all duration-300 flex items-center justify-end pr-2"
                    style={{
                      width: `${femalePercent}%`,
                      left: `${malePercent}%`,
                    }}
                  >
                    {parseFloat(femalePercent) > 5 && (
                      <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                        <span>{femalePercent}%</span>
                        <Venus className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                }
              />
            )}
          </>
        )}

        {genderFilter === 'male' && maleData && maleData.ratingsCount > 0 && (
          <NLTTooltip
            delay={500}
            message={`${t('male')}: ${t('grade', { count: maleData.ratingsCount })} (${malePercent}%), ${t('rating')}: ${maleData.averageRating.toFixed(1)}`}
            className={'bg-blue-500/85 max-w-[300px]'}
            trigger={
              <div
                className="absolute h-full bg-blue-500 transition-all duration-300 flex items-center justify-start pl-2"
                style={{
                  width: `${malePercent}%`,
                  left: 0,
                }}
              >
                {parseFloat(malePercent) > 5 && (
                  <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                    <Mars className="h-5 w-5" />
                    <span>{malePercent}%</span>
                  </div>
                )}
              </div>
            }
          />
        )}

        {genderFilter === 'female' && femaleData && femaleData.ratingsCount > 0 && (
          <NLTTooltip
            delay={500}
            message={`${t('female')}: ${t('grade', { count: femaleData.ratingsCount })} (${femalePercent}%), ${t('rating')}: ${femaleData.averageRating.toFixed(1)}`}
            className={'bg-pink-500/85 max-w-[300px]'}
            trigger={
              <div
                className="absolute h-full bg-pink-500 transition-all duration-300 flex items-center justify-start pl-2"
                style={{
                  width: `${femalePercent}%`,
                  left: 0,
                }}
              >
                {parseFloat(femalePercent) > 5 && (
                  <div className="flex gap-1 items-end text-xs font-medium text-white opacity-90">
                    <Venus className="h-5 w-5" />
                    <span>{femalePercent}%</span>
                  </div>
                )}
              </div>
            }
          />
        )}

        {totalRatings === 0 && (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">{t('no_data')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
