import { Wine } from 'lucide-react'
import { IReviewDetail } from '../../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { UserColorStats } from './user-color-stats'
import { UserAromaStats } from './user-aromas-stats'
import { UserCharacteristicsStats } from './user-characteristics-stats'
import { UserFlavorStats } from './user-flavor-stats'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { UserStatSkeleton } from './user-stat-skeleton'

interface ReviewDetailProps {
  detail?: IReviewDetail
  createdAt: string
  review: string
  isLoading: boolean
}

const getPluralForm = (count: number): 'one' | 'few' | 'many' => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'one'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'few'
  return 'many'
}

export const ReviewDetail = ({ review, createdAt, detail, isLoading }: ReviewDetailProps) => {
  const { t } = useTranslation('rate')

  if (isLoading) {
    return <UserStatSkeleton />
  }

  return (
    <div className="space-y-4 pr-4 mb-6">
      <div className="text-sm text-gray-500">
        {t('tasted_on')}:{' '}
        {new Date(createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Wine className="h-8 w-8 text-amber-700" />
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">"{review}"</p>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('tasting_sum')}</h3>
            <p className="text-gray-300 text-sm">{t('complex_grade')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {detail?.color && (
            <div className="text-center p-1 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">{detail?.color?.name || null}</div>
              <div className="text-sm text-gray-300"> {t(`color_${getPluralForm(1)}`)}</div>
            </div>
          )}
          {detail?.aromas && (
            <div className="text-center p-1 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">{detail?.aromas?.length || 0}</div>
              <div className="text-sm text-gray-300">{t(`aroma_${getPluralForm(detail?.aromas?.length || 0)}`)}</div>
            </div>
          )}
          {detail?.flavors && (
            <div className="text-center p-1 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">{detail?.flavors?.length || 0}</div>
              <div className="text-sm text-gray-300">{t(`taste_${getPluralForm(detail?.flavors?.length || 0)}`)}</div>
            </div>
          )}
          {detail?.tasteCharacteristics && (
            <div className="text-center p-1 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">{detail?.tasteCharacteristics?.length || 0}</div>
              <div className="text-sm text-gray-300">{t(`characteristic_${getPluralForm(detail?.tasteCharacteristics?.length || 0)}`)}</div>
            </div>
          )}
        </div>
      </div>

      {detail?.color && <UserColorStats color={detail?.color} />}
      <Separator />
      <UserAromaStats aromas={detail?.aromas || []} />
      <Separator />
      <UserFlavorStats tastes={detail?.flavors || []} />
      <Separator />
      <UserCharacteristicsStats characteristics={detail?.tasteCharacteristics || []} />
    </div>
  )
}
