export const TASTE_ENDPOINTS = {
  LIST: '/v1/admin/wine-flavors',
  CREATE: '/v1/admin/wine-flavors',
  UPDATE: '/v1/admin/wine-flavors/:tasteId',
  DELETE: '/v1/admin/wine-flavors/:tasteId',
  REORDER: '/v1/admin/wine-flavors/reorder',
} as const
