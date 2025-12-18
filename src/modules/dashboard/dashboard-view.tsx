import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { useReviews } from '../wine/list/presenters/useReviews'
import { ReviewDetail } from '../wine/list/ui/components/detail/user-statistics/review-detail'

export const DashboardView = () => {
  const { t } = useTranslation('navigation')

  const { reviewDetail } = useReviews()
  console.log(reviewDetail)
  return (
    <ContentLayout title={t('dashboard')}>
      <p>Content</p>
      <ReviewDetail review={reviewDetail} />
    </ContentLayout>
  )
}
