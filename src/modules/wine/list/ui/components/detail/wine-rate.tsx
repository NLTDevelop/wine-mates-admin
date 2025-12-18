import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface WineRateProps {
  userRate?: number
  expertRate?: number
  totalReviews?: number
}

export const WineRate = ({ userRate, expertRate, totalReviews }: WineRateProps) => {
  const { t } = useTranslation('rate')
  return (
    <div className='mb-4'>
      {userRate &&  (
        <div className="flex items-start md:items-center  gap-1 md:flex-row flex-col">
          {/* <span>{totalReviews?t('user_rate'):t('user_grade')}</span> */}
          <div className='flex gap-2 items-center'>
            {Array.from({ length: 5 }, (_, idx) => {
              const fillPercentage = Math.max(0, Math.min(1, userRate - idx)) * 100
              return (
                <div className="relative">
                  <Star size={20} key={idx} className="text-gray-300" />
                  <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                    <Star size={20} className="fill-yellow-500 text-yellow-500" />
                  </div>
                </div>
              )
            })}
          {totalReviews && <p>
            {userRate} ({t('review', { count: totalReviews })})
          </p>}
          </div>
        </div>
      )}
      {expertRate && (
        <div className="flex items-center gap-1">
          <span>{totalReviews?t('expert_rate'):t('expert_grade') }</span>
          <span className="font-bold ">{expertRate}</span>
        </div>
      )}
    </div>
  )
}
