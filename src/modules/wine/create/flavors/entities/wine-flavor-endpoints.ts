export const AROMA_CRUD_ENDPOINTS = {
  GROUP: {
    LIST: '/v1/admin/wine-aroma-groups',
    CREATE: '/v1/admin/wine-aroma-groups',
    UPDATE: '/v1/admin/wine-aroma-groups/:id',
    DELETE: '/v1/admin/wine-aroma-groups/:id',
    REORDER: '/v1/admin/wine-aroma-groups/reorder',
  },

  SUBGROUP: {
    LIST: '/v1/admin/wine-aroma-subgroups',
    CREATE: '/v1/admin/wine-aroma-subgroups',
    UPDATE: '/v1/admin/wine-aroma-subgroups/:id',
    DELETE: '/v1/admin/wine-aroma-subgroups/:id',
    REORDER: '/v1/admin/wine-aroma-subgroups/reorder',
  },
  AROMAS: {
    REORDER: '/v1/admin/wine-aromas/reorder',
  },
} as const
