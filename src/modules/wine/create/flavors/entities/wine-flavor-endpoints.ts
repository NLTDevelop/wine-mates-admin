import { BASE_ADMIN_PATH } from '@/constatnts/base-admin-path'

export const AROMA_CRUD_ENDPOINTS = {
  GROUP: {
    LIST: BASE_ADMIN_PATH + '/wine-aroma-groups',
    CREATE: BASE_ADMIN_PATH + '/wine-aroma-groups',
    UPDATE: BASE_ADMIN_PATH + '/wine-aroma-groups/:id',
    DELETE: BASE_ADMIN_PATH + '/wine-aroma-groups/:id',
  },

  SUBGROUP: {
    CREATE: BASE_ADMIN_PATH + '/wine-aroma-subgroups',
    UPDATE: BASE_ADMIN_PATH + '/wine-aroma-subgroups/:id',
    DELETE: BASE_ADMIN_PATH + '/wine-aroma-subgroups/:id',
  },
} as const
