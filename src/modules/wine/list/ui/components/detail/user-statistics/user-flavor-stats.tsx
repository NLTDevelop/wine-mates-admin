import { IReviewDetail } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserFlavorStatsProps {
  tastes: IReviewDetail['flavors']
}

export const UserFlavorStats = ({ tastes }: UserFlavorStatsProps) => {
  const { t } = useTranslation('wines')

  return (
    tastes &&
    tastes.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('tastes.tastes')}</h3>

        <div className="space-y-2">
          {tastes.map(flavor => (
            <div key={flavor.id} className="flex items-center flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                <div className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: flavor.colorHex }} />
                <span className="font-medium truncate sm:max-w-[400px] max-w-[150px]">{flavor.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  )
}
