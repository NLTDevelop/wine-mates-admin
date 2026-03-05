import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReviews } from '../../../presenters/useReviews'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { Card } from '@/UIKit/shadcn/ui/card'
import { formatTimeDate } from '@/lib/date-utils'
import { WineRate } from './wine-rate'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { USER_CATEGORIES } from '@/modules/users/entities/IUser'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { ReviewDetail } from './user-statistics/review-detail'
import { cn } from '@/lib/utils'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { ReviewCardSkeleton } from './user-statistics/review-card-skeleton'

interface ReviewsSectionProps {
  wineName?: string
  wineId?: string
}

export const ReviewsSection = ({ wineName, wineId }: ReviewsSectionProps) => {
  const { t } = useTranslation('rate')
  const { t: tc } = useTranslation('common')
  const { reviewDetail, reviewFilters, totalCount, isLoading, onChangePagination, reviewModal, reviews, isLoadingDetail } = useReviews(wineId!)

  if (isLoading && !reviews?.length) {
    return <ReviewCardSkeleton />
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <Users />
        {t('reviews_users')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {reviews?.map(review => (
          <Card
            key={review.id}
            onClick={() => reviewModal.onOpen({ reviewId: String(review.id), name: `${review.user.firstName} ${review.user.lastName}`, createdAt: review.createdAt, review: review.review })}
            className="cursor-pointer flex flex-col"
          >
            <div className="flex-1">
              <div className="flex items-start gap-2 ">
                <p className="text-description">
                  {review.user?.firstName ?? ''} {review.user?.lastName ?? ''}
                </p>
                <Badge
                  className={cn('text-accent-foreground pointer-events-none cursor-auto', `${review.user.wineExperienceLevel === USER_CATEGORIES.WINE_LOVER ? 'bg-primary/20' : 'bg-primary/50'}`)}
                >
                  {review.user.wineExperienceLevel}
                </Badge>
              </div>
              <WineRate userRate={review.userRating} expertRate={review.expertRating} />
              <p>{review.review}</p>
            </div>
            <p className="pt-2 text-gray-400 text-sm text-end">{formatTimeDate(review.createdAt)}</p>
          </Card>
        ))}
      </div>
      {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={reviewFilters.limit} page={reviewFilters.page} totalRows={totalCount || 0} setPage={onChangePagination} />}

      <NLTModal title={t('review_detail', { user: `${reviewModal.userName}`, wine: wineName })} isOpen={reviewModal.isOpen} onClose={reviewModal.onClose}>
        <ReviewDetail review={reviewModal.review} createdAt={reviewModal.createdAt} detail={reviewDetail} isLoading={isLoadingDetail} />
        <div className="text-end pr-4">
          <Button type="button" variant="outline" onClick={reviewModal.onClose}>
            {tc('button.close')}
          </Button>
        </div>
      </NLTModal>
    </>
  )
}
