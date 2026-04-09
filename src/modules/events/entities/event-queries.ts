import { eventsService } from './events-service'
import { IEventFilters } from './types'

export const eventQueries = {
  list: (filters: IEventFilters) => ({
    queryKey: ['events', 'list', filters],
    queryFn: () => eventsService.list(filters),
  }),

  detail: (eventId: string) => ({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => eventsService.detail(eventId),
    enabled: !!eventId,
  }),

  delete: () => ({
    mutationKey: ['events', 'delete'],
    mutationFn: (id: number) => eventsService.delete(id),
  }),
}
