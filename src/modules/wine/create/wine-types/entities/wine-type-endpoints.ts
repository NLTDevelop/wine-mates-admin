export const WINE_TYPE_ENDPOINTS = {
  LIST: '/v1/admin/wine-types',
  CREATE: '/v1/admin/wine-types',
  UPDATE: '/v1/admin/wine-types/:wineTypeValue',
  DELETE: '/v1/admin/wine-types/:wineTypeValue',
  REORDER: '/v1/admin/wine-types/reorder',
} as const
