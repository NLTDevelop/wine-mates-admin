import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useWineStore } from '../entities/wine-list-store'
import { wineQueries } from '../entities/wine-list-queries'
import { ReviewsResponse } from '../entities/types/types'
import { statistics } from '../ui/components/detail/mockStatictics'

export const mockReviewsResponse: ReviewsResponse = {
  count: 127,
  totalPages: 13,
  rows: [
    {
      id: 1,
      userRating: 5,
      expertRating: 55,
      review: 'Amazing wine with great taste! The aroma is incredible and the finish is smooth.',
      createdAt: '2025-12-01T10:30:00Z',
      user: {
        id: 4,
        firstName: 'John',
        lastName: 'Doe',
        wineExperienceLevel: 'expert',
        avatar: {
          smallUrl: 'https://example.com/avatars/small/user-4.jpg',
          mediumUrl: 'https://example.com/avatars/medium/user-4.jpg',
          originalUrl: 'https://example.com/avatars/original/user-4.jpg',
        },
      },
      statistics: statistics,
    },
    {
      id: 2,
      userRating: 4,
      expertRating: 80,
      review: 'Good wine, enjoyed it with dinner.',
      createdAt: '2025-11-30T15:20:00Z',
      user: {
        id: 7,
        firstName: 'Jane',
        lastName: 'Smith',
        wineExperienceLevel: 'creator',
        avatar: null,
      },
    },
    {
      id: 3,
      userRating: 3,
      expertRating: 65,
      review: 'Decent wine for the price. Nothing exceptional but drinkable.',
      createdAt: '2025-11-28T14:15:00Z',
      user: {
        id: 12,
        firstName: 'Robert',
        lastName: 'Johnson',
        wineExperienceLevel: 'lower',
        avatar: {
          smallUrl: 'https://example.com/avatars/small/user-12.jpg',
          mediumUrl: 'https://example.com/avatars/medium/user-12.jpg',
          originalUrl: 'https://example.com/avatars/original/user-12.jpg',
        },
      },
    },
    {
      id: 4,
      userRating: 5,
      expertRating: 92,
      review: 'Exceptional wine! Complex notes of blackberry and oak with a long finish.',
      createdAt: '2025-11-25T09:45:00Z',
      user: {
        id: 8,
        firstName: 'Michael',
        lastName: 'Brown',
        wineExperienceLevel: 'expert',
        avatar: {
          smallUrl: 'https://example.com/avatars/small/user-8.jpg',
          mediumUrl: 'https://example.com/avatars/medium/user-8.jpg',
          originalUrl: 'https://example.com/avatars/original/user-8.jpg',
        },
      },
    },
    {
      id: 5,
      userRating: 2,
      expertRating: 40,
      review: 'Too acidic for my taste. Would not buy again.',
      createdAt: '2025-11-20T16:30:00Z',
      user: {
        id: 15,
        firstName: 'Sarah',
        lastName: 'Wilson',
        wineExperienceLevel: 'lover',
        avatar: null,
      },
    },
  ],
}

export const useReviews = () => {
  const { reviewFilters, setReviewFilters } = useWineStore()

  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; reviewId: string | null; userName: string }>({ isOpen: false, reviewId: null, userName: '' })
  const [reviewId, setReviewId] = useState<string | null>(null)

  const reviewsQuery: UseQueryResult<ReviewsResponse | undefined, Error> = useQuery(wineQueries.reviews(reviewFilters))
  const reviewQuery = useQuery(wineQueries.review_detail(reviewId!))

  const onChangePagination = useCallback(
    (page: number) => {
      setReviewFilters({ page })
    },
    [setReviewFilters]
  )

  const openReviewModal = useCallback(({ reviewId, name }: { reviewId: string; name: string }) => {
    setReviewId(reviewId)
    setReviewModal({
      isOpen: true,
      reviewId: reviewId,
      userName: name,
    })
  }, [])

  const closeReviewModal = useCallback(() => {
    setReviewModal({
      isOpen: false,
      reviewId: null,
      userName: '',
    })
    setReviewId(null)
  }, [])

  return {
    reviews: mockReviewsResponse.rows,
    // reviews: reviewsQuery.data?.rows,
    totalCount: mockReviewsResponse.count,
    // totalCount: reviewsQuery.data?.count,
    isLoading: reviewsQuery.isLoading,
    reviewFilters,

    onChangePagination,

    reviewModal: {
      ...reviewModal,
      onClose: closeReviewModal,
      onOpen: openReviewModal,
    },
    reviewDetail: mockReviewsResponse.rows[0],
    // reviewDetail:reviewQuery,
    isLoadingDetail: reviewQuery.isLoading,
  }
}
