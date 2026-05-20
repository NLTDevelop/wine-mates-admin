export const EVENT_ENDPOINTS = {
  LIST: '/v1/admin/events',
  UPDATE: '/v1/admin/events/{id}',
  DETAIL: '/v1/admin/events/{id}',
  DELETE: '/v1/admin/events/{id}',
  SEARCH_WINE_SET: '/v1/wines/search/wine-set',
  CURRENCY: {
    LIST: '/v1/admin/currencies',
  },
} as const
