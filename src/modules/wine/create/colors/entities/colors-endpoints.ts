export const COLOR_CRUD_ENDPOINTS = {
  COLORS: {
    LIST: '/v1/admin/wine-colors',
    CREATE: '/v1/admin/wine-colors',
    UPDATE: '/v1/admin/wine-colors/{id}',
    DELETE: '/v1/admin/wine-colors/{id}',
  },

  COLOR_SHADES: {
    CREATE: '/v1/admin/wine-color-shades',
    UPDATE: '/v1/admin/wine-color-shades/{id}',
    DELETE: '/v1/admin/wine-color-shades/{id}',
    REORDER: '/v1/admin/wine-color-shades/reorder',
  },
} as const
