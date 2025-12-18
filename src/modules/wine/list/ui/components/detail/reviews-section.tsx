import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReviews } from '../../../presenters/useReviews'
import { NLTTablePagination } from '@/UIKit/components/NLTTablePagination'
import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { Card } from '@/UIKit/shadcn/ui/card'
import { formatTimeDate } from '@/lib/date-utils'
import { WineRate } from './wine-rate'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { USER_CATEGORIES } from '@/modules/users/entities/IUser'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { ReviewDetail } from './user-statistics/review-detail'
import { cn } from '@/lib/utils'

interface ReviewsSectionProps {
  wineName?: string
}

export const ReviewsSection = ({ wineName }: ReviewsSectionProps) => {
  const { t } = useTranslation('rate')
  const { t: tc } = useTranslation('common')
  const { reviewDetail, reviewFilters, totalCount, isLoading, onChangePagination, reviewModal, reviews, isLoadingDetail } = useReviews()

  return (
    <>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 pt-4">
        <Users />
        {t('reviews_users')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {reviews.map(review => (
          <Card key={review.id} onClick={() => reviewModal.onOpen(String(review.id))} className="cursor-pointer">
            <div className="h-full">
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
              <WineRate userRate={1.7} expertRate={75.2} />
              <p className="">{review.review}</p>
            </div>
            <p className="pb-2 text-gray-400 text-sm text-end">{formatTimeDate(review.createdAt)}</p>
          </Card>
        ))}
      </div>
      <NLTTablePagination limit={reviewFilters.limit} page={reviewFilters.page} totalRows={totalCount || 0} setPage={onChangePagination} />
      {/* {totalCount && totalCount > DEFAULT_PAGINATION_LIMIT && <NLTTablePagination limit={reviewFilters.limit} page={reviewFilters.page} totalRows={totalCount || 0} setPage={onChangePagination} />} */}
      <NLTModal title={t('review_detail', { user: `${reviewDetail.user.firstName} ${reviewDetail.user.lastName}`, wine: wineName })} isOpen={reviewModal.isOpen} onClose={reviewModal.onClose}>
        <ReviewDetail review={reviewDetail} />
        <div className="text-end pr-4">
          <Button type="button" variant="outline" onClick={reviewModal.onClose}>
            {tc('button.close')}
          </Button>
        </div>
      </NLTModal>
    </>
  )
}
