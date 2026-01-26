export const TASTE_ENDPOINTS = {
  GROUP: {
    LIST: '/v1/admin/wine-flavor-groups',
    CREATE: '/v1/admin/wine-flavor-groups',
    UPDATE: '/v1/admin/wine-flavor-groups/:id',
    DELETE: '/v1/admin/wine-flavor-groups/:id',
    REORDER: '/v1/admin/wine-flavor-groups/reorder',
  },
  TASTES: {
    CREATE: '/v1/admin/wine-flavors',
    UPDATE: '/v1/admin/wine-flavors/:id',
    DELETE: '/v1/admin/wine-flavors/:id',
    REORDER: '/v1/admin/wine-flavors/reorder',
  },
} as const
