export const WINERY_WINE_LIST_ENDPOINTS = {
  LIST_WINE: '/v1/admin/wineries/{id}/wines',
  LIST_WINE_EMPTY_WINERY: '/v1/admin/wines/winery',
  ADD_WINE: '/v1/admin/winery-wines',
  DELETE_WINE: '/v1/admin/winery-wines',
  CREATE_OFFER: '/v1/admin/winery-wine-offers',
  UPDATE_OFFER: '/v1/admin/winery-wine-offers/{id}',
  DELETE_OFFER: '/v1/admin/winery-wine-offers/{id}',
} as const
