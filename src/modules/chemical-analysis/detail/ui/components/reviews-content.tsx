import { formatTimeDate } from '@/lib/date-utils'
import { IReview } from '@/modules/wine/list/entities/types/types'
import { WineRate } from '@/modules/wine/list/ui/components/detail/wine-rate'
import { Card } from '@/UIKit/shadcn/ui/card'
import { Bookmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ReviewsContentProps {
  reviews: IReview[]
}

export const ReviewsContent = ({ reviews }: ReviewsContentProps) => {
  const { t } = useTranslation('analysis')
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <Bookmark />
        {t('reviews')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {reviews?.map(review => (
          <Card key={review.id} className="flex flex-col">
            <div className="flex-1">
              <div className="flex items-start gap-2 ">
                <p className="text-description">
                  {review.user?.firstName ?? ''} {review.user?.lastName ?? ''}
                </p>
              </div>
              <WineRate userRate={review.userRating} expertRate={review.expertRating} />
              <p>{review.review}</p>
            </div>
            <p className="pt-2 text-gray-400 text-sm text-end">{formatTimeDate(review.createdAt)}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
