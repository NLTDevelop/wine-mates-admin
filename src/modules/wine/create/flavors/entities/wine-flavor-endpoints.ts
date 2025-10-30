export const AROMA_CRUD_ENDPOINTS = {
  GROUPS: {
    LIST: '/aroma-groups',
    CREATE: '/aroma-groups',
    DETAIL: '/aroma-groups/:groupId',
    UPDATE: '/aroma-groups/:groupId',
    DELETE: '/aroma-groups/:groupId',
  },

  ITEMS: {
    LIST: '/aroma-items',
    CREATE: '/aroma-items',
    DETAIL: '/aroma-items/:itemId',
    UPDATE: '/aroma-items/:itemId',
    DELETE: '/aroma-items/:itemId',
  },

  GROUP_ITEMS: {
    LIST: '/aroma-groups/:groupId/items',
    CREATE: '/aroma-groups/:groupId/items',
  },
} as const
