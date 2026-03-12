import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { MapEvent } from '../../entities/types'
import { EVENT_LIST_ENDPOINTS } from './event-list-endpoints'
import { CancelEventParams, EventFiltersData, EventResponse, IEvent, IEventFilters, UpdateEventListParams } from './types'

export const eventListService = {
  detail: (id: string | number): Promise<{ data: MapEvent }> => api.get(buildUrl(EVENT_LIST_ENDPOINTS.DETAIL, { id })),

  list: (filters: IEventFilters): Promise<EventResponse> => api.get(EVENT_LIST_ENDPOINTS.LIST, { params: filters }).then(response => response.data),

  create: (eventData: IEvent): Promise<MapEvent> => api.post(EVENT_LIST_ENDPOINTS.CREATE, eventData).then(response => response.data),

  cancel: ({ id, isCanceled }: CancelEventParams) => api.patch(buildUrl(EVENT_LIST_ENDPOINTS.CANCEL, { id }), { isCanceled }),

  update: ({ id, data }: UpdateEventListParams) => api.patch(buildUrl(EVENT_LIST_ENDPOINTS.UPDATE, { id }), data).then(response => response.data),

  delete: (id: number): Promise<void> => api.delete(buildUrl(EVENT_LIST_ENDPOINTS.DELETE, { id })).then(response => response.data),

  getFilterOptions: (): Promise<EventFiltersData> => api.get(EVENT_LIST_ENDPOINTS.FILTER_OPTIONS).then(response => response.data),
}
