import { Wine } from 'lucide-react'
import { IReview } from '../../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { UserColorStats } from './user-color-stats'
import { UserAromaStats } from './user-aromas-stats'
import { UserCharacteristicsStats } from './user-characteristics-stats'
import { UserFlavorStats } from './user-flavor-stats'
import { Separator } from '@/UIKit/shadcn/ui/separator'

interface ReviewDetailProps {
  review: IReview
}

const getPluralForm = (count: number): 'one' | 'few' | 'many' => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'one'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'few'
  return 'many'
}

export const ReviewDetail = ({ review }: ReviewDetailProps) => {
  const { t } = useTranslation('rate')
  const stats = review.statistics

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Wine className="mx-auto h-12 w-12 mb-4 text-gray-300" />
        <p>{t('noStatistics') || 'No tasting notes available'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pr-4 mb-6">
      <div className="text-sm text-gray-500">
        {t('tasted_on')}:{' '}
        {new Date(review.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Wine className="h-8 w-8 text-amber-700" />
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">"{review.review}"</p>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('tasting_sum')}</h3>
            <p className="text-gray-300 text-sm">{t('complex_grade')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-1 bg-white/10 rounded-lg">
            <div className="text-xl font-bold">{stats.topColors?.length || 0}</div>
            <div className="text-sm text-gray-300"> {t(`color_${getPluralForm(stats.topColors?.length || 0)}`)}</div>
          </div>
          <div className="text-center p-1 bg-white/10 rounded-lg">
            <div className="text-xl font-bold">{stats.topAromas?.length || 0}</div>
            <div className="text-sm text-gray-300">{t(`aroma_${getPluralForm(stats.topAromas?.length || 0)}`)}</div>
          </div>
          <div className="text-center p-1 bg-white/10 rounded-lg">
            <div className="text-xl font-bold">{stats.topFlavors?.length || 0}</div>
            <div className="text-sm text-gray-300">{t(`taste_${getPluralForm(stats.topFlavors?.length || 0)}`)}</div>
          </div>
          <div className="text-center p-1 bg-white/10 rounded-lg">
            <div className="text-xl font-bold">{stats.tasteCharacteristics?.length || 0}</div>
            <div className="text-sm text-gray-300">{t(`characteristic_${getPluralForm(stats.tasteCharacteristics?.length || 0)}`)}</div>
          </div>
        </div>
      </div>

      <UserColorStats stats={stats} />
      <Separator />
      <UserAromaStats stats={stats} />
      <Separator />
      <UserFlavorStats stats={stats} />
      <Separator />
      <UserCharacteristicsStats stats={stats} />
    </div>
  )
}
