export const AROMA_CRUD_ENDPOINTS = {
  GROUP: {
    LIST: '/wine-aroma-groups',
    CREATE: '/wine-aroma-groups',
    UPDATE: '/wine-aroma-groups/:id',
    DELETE: '/wine-aroma-groups/:id',
  },

  SUBGROUP: {
    CREATE: '/wine-aroma-subgroups',
    UPDATE: '/wine-aroma-subgroups/:id',
    DELETE: '/wine-aroma-subgroups/:id',
  },

  AROMA: {
    CREATE: '/wine-aromas',
    UPDATE: '/wine-aromas/:id',
    DELETE: '/wine-aromas/:id',
  },
} as const
