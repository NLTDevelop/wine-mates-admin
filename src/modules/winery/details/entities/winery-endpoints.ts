export const WINERY_ENDPOINTS = {
  CONFIRM: '/v1/admin/winery-applications/{wineryId}',
  DETAIL: '/v1/admin/wineries/{id}',
  LIST_WINE: '/v1/admin/wineries:id/wines',
  ADD_WINE: '/v1/admin/winery-wines',
  DELETE_WINE: '/v1/admin/winery-wines',
} as const
