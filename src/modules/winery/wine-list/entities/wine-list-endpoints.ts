export const WINERY_WINE_LIST_ENDPOINTS = {
  LIST_WINE: '/v1/admin/wineries/{id}/wines',
  LIST_WINE_EMPTY_WINERY: '/v1/admin/wines/winery',
  ADD_WINE: '/v1/admin/winery-wines',
  DELETE_WINE: '/v1/admin/winery-wines',
} as const
