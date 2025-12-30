import { IReviewDetail } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

interface UserColorStatsProps {
  color: IReviewDetail['color']
}
export const UserColorStats = ({ color }: UserColorStatsProps) => {
  const { t } = useTranslation('wines')
  return (
    color &&
    Object.keys(color).length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t('colors.shade')}</h3>

        <div className="space-y-2">
          <div className="flex items-center flex-wrap gap-2">
            {color.shade && Object.keys(color.shade).length > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 ">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.shade.colorHex }} />
                  <span className="">{color.shade.name}</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded border border-input/40">
                  <span className="text-sm font-medium">{color.shade.tone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  )
}
