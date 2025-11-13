import { BASE_ADMIN_PATH } from '@/constatnts/base-admin-path'

export const COLOR_CRUD_ENDPOINTS = {
  COLORS: {
    LIST: BASE_ADMIN_PATH + '/colors',
    CREATE: BASE_ADMIN_PATH + '/colors',
    UPDATE: BASE_ADMIN_PATH + '/colors/:colorId',
    DELETE: BASE_ADMIN_PATH + '/colors/:colorId',
  },

  COLOR_SHADES: {
    CREATE: BASE_ADMIN_PATH + '/color-shade',
    UPDATE: BASE_ADMIN_PATH + '/color-shade/:id',
    DELETE: BASE_ADMIN_PATH + '/color-shade/:id',
  },
} as const
