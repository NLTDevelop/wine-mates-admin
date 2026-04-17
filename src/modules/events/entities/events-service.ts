import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { EVENT_ENDPOINTS } from './event-endpoints'
import { EventResponse, IEvent } from './types/IEvent'
import { IEventFilters } from './types/filters.dto'
import { UpdateEventParams } from './types/update-event.dto'
import { WineSearchParams, WineSearchResponse } from './types/wine-search.dto'

export const eventsService = {
  detail: (id: string | number): Promise<{ data: IEvent }> => api.get(buildUrl(EVENT_ENDPOINTS.DETAIL, { id })),

  list: (filters: IEventFilters): Promise<EventResponse> => api.get(EVENT_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  delete: (id: number): Promise<void> => api.delete(buildUrl(EVENT_ENDPOINTS.DELETE, { id })).then(response => response.data),

  update: ({ id, data }: UpdateEventParams) => api.patch(buildUrl(EVENT_ENDPOINTS.UPDATE, { id }), data).then(response => response.data),

  search: async (params: WineSearchParams): Promise<WineSearchResponse> => api.get(EVENT_ENDPOINTS.SEARCH_WINE_SET, { params }).then(response => response.data),
}
