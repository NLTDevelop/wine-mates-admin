export const WINE_PROFILE_ENDPOINTS = {
  LIST: '/v1/admin/wine-templates',
  CREATE: '/v1/admin/wine-templates',
  UPDATE: '/v1/admin/wine-templates/:id',
  DELETE: '/v1/admin/wine-templates/:id',
  DETAIL: '/v1/admin/wine-templates/:id',
  FORMDATA: '/v1/admin/wine-templates/form-data',
} as const
