export const WINE_LIST_ENDPOINTS = {
  LIST: '/v1/admin/wines',
  CREATE: '/v1/admin/wines',
  DETAIL: '/v1/admin/wines/{id}',
  UPDATE: '/v1/admin/wines/{id}',
  DELETE: '/v1/admin/wines/{id}',
  CONFIRM: '/v1/admin/wines/{id}/confirmation',
  IMPORT: '/v1/admin/import-wines',
  RATES: '/v1/admin/rates',
  RATE_DETAIL: '/v1/admin/rates/{id}',
  MERGE: '/v1/admin/wines/merge',
  FILTER_OPTIONS: '/v1/admin/wines/filter-options',
} as const
