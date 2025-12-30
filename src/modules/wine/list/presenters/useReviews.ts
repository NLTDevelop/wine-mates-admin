import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useWineStore } from '../entities/wine-list-store'
import { wineQueries } from '../entities/wine-list-queries'
import { ReviewsResponse } from '../entities/types/types'

export const useReviews = (wineId: string) => {
  const { reviewFilters, setReviewFilters } = useWineStore()

  useEffect(() => {
    if (wineId) {
      setReviewFilters({
        wineId: Number(wineId),
        page: 1,
        search: '',
      })
    }
  }, [wineId, setReviewFilters])

  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; reviewId: string | null; userName: string; createdAt: string; review: string }>({
    isOpen: false,
    reviewId: null,
    userName: '',
    createdAt: '',
    review: '',
  })
  const [reviewId, setReviewId] = useState<string | null>(null)

  const reviewsQuery: UseQueryResult<ReviewsResponse | undefined, Error> = useQuery({ ...wineQueries.reviews(reviewFilters), enabled: !!reviewFilters.wineId })
  const reviewQuery = useQuery({ ...wineQueries.review_detail(reviewId!), enabled: !!reviewId })

  const onChangePagination = useCallback(
    (page: number) => {
      setReviewFilters({ page })
    },
    [setReviewFilters]
  )

  const openReviewModal = useCallback(({ reviewId, name, createdAt, review }: { reviewId: string; name: string; createdAt: string; review: string }) => {
    setReviewId(reviewId)
    setReviewModal({
      isOpen: true,
      reviewId: reviewId,
      userName: name,
      createdAt,
      review,
    })
  }, [])

  const closeReviewModal = useCallback(() => {
    setReviewModal({
      isOpen: false,
      reviewId: null,
      userName: '',
      createdAt: '',
      review: '',
    })
    setReviewId(null)
  }, [])

  return {
    reviews: reviewsQuery.data?.rows,
    totalCount: reviewsQuery.data?.count,
    isLoading: reviewsQuery.isLoading,
    reviewFilters,

    onChangePagination,

    reviewModal: {
      ...reviewModal,
      onClose: closeReviewModal,
      onOpen: openReviewModal,
    },
    reviewDetail: reviewQuery.data,
    isLoadingDetail: reviewQuery.isLoading,
  }
}
