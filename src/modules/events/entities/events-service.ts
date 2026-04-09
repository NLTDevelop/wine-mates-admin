import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { EventResponse, IEvent, IEventFilters } from './types'
import { EVENT_ENDPOINTS } from './event-endpoints'

export const eventsService = {
  detail: (id: string | number): Promise<{ data: IEvent }> => api.get(buildUrl(EVENT_ENDPOINTS.DETAIL, { id })),

  list: (filters: IEventFilters): Promise<EventResponse> => api.get(EVENT_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  delete: (id: number): Promise<void> => api.delete(buildUrl(EVENT_ENDPOINTS.DELETE, { id })).then(response => response.data),
}
