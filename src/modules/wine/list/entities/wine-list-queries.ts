import { UpdateWineListParams, WineFilters, CreateWineRequest, ReviewFilters, IReviewDetail, CreateMergeRequest } from './types/types'
import { wineListService } from './wine-list-service'

export const wineQueries = {
  list: (filters: WineFilters) => ({
    queryKey: ['wines', 'list', filters],
    queryFn: () => wineListService.list(filters),
  }),

  detail: (wineId: string) => ({
    queryKey: ['wines', 'detail', wineId],
    queryFn: () => wineListService.detail(wineId),
    enabled: !!wineId,
  }),

  confirmWine: () => ({
    mutationKey: ['wines', 'confirmWine'],
    mutationFn: ({ id, isConfirmed }: { id: string; isConfirmed: boolean }) => wineListService.confirm({ id, isConfirmed }),
  }),

  create: () => ({
    mutationKey: ['wines', 'create'],
    mutationFn: (wineData: CreateWineRequest) => wineListService.create(wineData),
  }),

  update: () => ({
    mutationKey: ['wines', 'update'],
    mutationFn: ({ id, data }: UpdateWineListParams) => wineListService.update({ id, data }),
  }),

  delete: () => ({
    mutationKey: ['wines', 'delete'],
    mutationFn: (id: string) => wineListService.delete(id),
  }),

  merge: () => ({
    mutationKey: ['wines', 'merge'],
    mutationFn: (mergeWineData: CreateMergeRequest) => wineListService.merge(mergeWineData),
  }),

  filters: () => ({
    queryKey: ['wine-filters', 'all'],
    queryFn: () => wineListService.getFilterOptions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }),

  import: () => ({
    mutationKey: ['wines', 'import'],
    mutationFn: (file: File) => wineListService.import(file),
  }),

  reviews: (filters: ReviewFilters) => ({
    queryKey: ['wines', 'reviews', filters],
    queryFn: () => wineListService.reviews(filters),
  }),

  review_detail: (id: string) => ({
    queryKey: ['wines', 'review-detail', id],
    queryFn: async (): Promise<IReviewDetail> => {
      const response = await wineListService.review_detail(id)
      return response.data
    },
  }),
}
