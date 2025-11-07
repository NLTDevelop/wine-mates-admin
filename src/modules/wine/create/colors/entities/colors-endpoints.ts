export const COLOR_CRUD_ENDPOINTS = {
  COLORS: {
    LIST: '/colors',
    CREATE: '/colors',
    DETAIL: '/colors/:colorId',
    UPDATE: '/colors/:colorId',
    DELETE: '/colors/:colorId',
  },

  SHADES: {
    LIST: '/shades',
    CREATE: '/shades',
    DETAIL: '/shades/:shadeId',
    UPDATE: '/shades/:shadeId',
    DELETE: '/shades/:shadeId',
  },

  COLOR_SHADES: {
    LIST: '/colors/:colorId/shades',
    CREATE: '/colors/:colorId/shades',
    UPDATE: '/colors/:colorId/shades/:shadeId',
    REORDER: '/colors/:colorId/shades/reorder',
  },
} as const
