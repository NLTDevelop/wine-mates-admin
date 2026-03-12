import { eventListService } from './event-list-service'
import { IEvent, IEventFilters, UpdateEventListParams } from './types'

export const eventQueries = {
  list: (filters: IEventFilters) => ({
    queryKey: ['events', 'list', filters],
    queryFn: () => eventListService.list(filters),
  }),

  detail: (eventId: number) => ({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => eventListService.detail(eventId),
    enabled: !!eventId,
  }),

  cancelEvent: () => ({
    mutationKey: ['events', 'cancelEvent'],
    mutationFn: ({ id, isCanceled }: { id: number; isCanceled: boolean }) => eventListService.cancel({ id, isCanceled }),
  }),

  create: () => ({
    mutationKey: ['events', 'create'],
    mutationFn: (eventData: IEvent) => eventListService.create(eventData),
  }),

  update: () => ({
    mutationKey: ['events', 'update'],
    mutationFn: ({ id, data }: UpdateEventListParams) => eventListService.update({ id, data }),
  }),

  delete: () => ({
    mutationKey: ['events', 'delete'],
    mutationFn: (id: number) => eventListService.delete(id),
  }),

  filters: () => ({
    queryKey: ['events-filters', 'all'],
    queryFn: () => eventListService.getFilterOptions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }),
}
