export const TASTE_CHARACTERISTICS_ENDPOINTS = {
  LIST: '/taste-characteristics',
  CREATE: '/taste-characteristics',
  UPDATE: '/taste-characteristics/:characteristicId',
  DELETE: '/taste-characteristics/:characteristicId',
  REORDER_LEVEL: '/v1/taste-characteristics/:id/reorder',
} as const
