export const EVENT_LIST_ENDPOINTS = {
  LIST: '/v1/admin/events',
  CREATE: '/v1/admin/events',
  DETAIL: '/v1/admin/events/{id}',
  UPDATE: '/v1/admin/events/{id}',
  DELETE: '/v1/admin/events/{id}',
  CANCEL: '/v1/admin/events/{id}/cancel',
  FILTER_OPTIONS: '/v1/admin/events/filter-options',
} as const
