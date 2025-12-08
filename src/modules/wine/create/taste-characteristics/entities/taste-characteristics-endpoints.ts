export const TASTE_CHARACTERISTICS_ENDPOINTS = {
  LIST: '/v1/admin/wine-taste-characteristics',
  CREATE: '/v1/admin/wine-taste-characteristics',
  UPDATE: '/v1/admin/wine-taste-characteristics/:characteristicId',
  DELETE: '/v1/admin/wine-taste-characteristics/:characteristicId',
  REORDER: '/v1/admin/wine-taste-characteristics/reorder',
  REORDER_LEVEL: '/v1/admin/wine-taste-characteristic-levels/reorder',
} as const
