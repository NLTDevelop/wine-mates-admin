import { IReviewDetail } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserAromaStatsProps {
  aromas: IReviewDetail['aromas']
}

export const UserAromaStats = ({ aromas }: UserAromaStatsProps) => {
  const { t } = useTranslation('wines')

  return (
    aromas &&
    aromas.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('flavors.flavors')}</h3>

        <div className="space-y-2">
          {aromas.map(aroma => (
            <div key={aroma.id} className="flex flex-col sm:flex-row sm:items-start sm:flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                <div className="h-4 w-4 rounded shrink-0" style={{ backgroundColor: aroma.colorHex }} />
                <span className="font-medium truncate sm:max-w-[200px] max-w-[150px]">{aroma.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  )
}
