export const TASTE_CHARACTERISTICS_ENDPOINTS = {
  LIST: '/taste-characteristics',
  CREATE: '/taste-characteristics',
  UPDATE: '/taste-characteristics/:characteristicId',
  DELETE: '/taste-characteristics/:characteristicId',

  // ITEMS: {
  //   LIST: '/taste-items',
  //   CREATE: '/taste-items',
  //   DETAIL: '/taste-items/:itemId',
  //   UPDATE: '/taste-items/:itemId',
  //   DELETE: '/taste-items/:itemId',
  // },

  // CHARACTERISTIC_ITEMS: {
  //   LIST: '/taste-characteristics/:characteristicId/items',
  //   CREATE: '/taste-characteristics/:characteristicId/items',
  // },

  // LEVELS: {
  //   UPDATE_ORDER: '/taste-characteristics/:characteristicId/levels/order',
  //   UPDATE_LEVEL: '/taste-characteristics/:characteristicId/levels/:levelId',
  // },
} as const
