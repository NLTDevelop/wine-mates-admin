import { eventsService } from './events-service'
import { IEventFilters } from './types/filters.dto'
import { UpdateEventParams } from './types/update-event.dto'

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

  update: () => ({
    mutationKey: ['events', 'update'],
    mutationFn: ({ id, data }: UpdateEventParams) => eventsService.update({ id, data }),
  }),

  delete: () => ({
    mutationKey: ['events', 'delete'],
    mutationFn: (id: number) => eventsService.delete(id),
  }),

  currency: () => ({
    queryKey: ['currency', 'list'],
    queryFn: () => eventsService.currency_list(),
  }),
}
