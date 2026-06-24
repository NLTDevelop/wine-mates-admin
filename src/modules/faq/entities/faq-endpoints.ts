export const FAQ_ENDPOINTS = {
  GROUP: {
    LIST: '/v1/admin/faq/topics',
    CREATE: '/v1/admin/faq/topics',
    UPDATE: '/v1/admin/faq/topics/:id',
    DELETE: '/v1/admin/faq/topics/:id',
    REORDER: '/v1/admin/faq/topics/reorder',
  },
  QUESTION: {
    CREATE: '/v1/admin/faq/questions',
    UPDATE: '/v1/admin/faq/questions/:id',
    DELETE: '/v1/admin/faq/questions/:id',
    REORDER: '/v1/admin/faq/questions/reorder',
  },
} as const
