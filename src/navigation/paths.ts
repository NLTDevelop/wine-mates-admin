export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USERS_DETAIL: '/users/:id',
  FEATURES: '/features',
  FEATURE_CREATE: '/features/create',
  WINE_CREATE: '/wines/create',
  WINE_LIST: '/wines',
  WINE_DETAIL: '/wines/:id',
  WINERIES_LIST: '/wineries',
  WINERY_CREATE: '/wineries/create',
  WINERY_DETAIL: '/winery/:id',
  WINERY_ADD_WINE: '/winery/:id/add-wine',
  PARTNERS_LIST: '/partners',
  PARTNER_CREATE: '/partners/create',
  PARTNER_DETAIL: '/partners/:id',
  WINE_USER_PROPOSITIONS: '/wines/user-propositions',
  WINE_CREATING: '/wines/creating',
  STATS: '/stats',
  ANALYSIS: '/analysis',
  ANALYSIS_DETAIL: '/analysis/:id',
  AI_PROMTS: '/features/ai-promts',
  CUISINE: '/features/cuisine',
  EVENTS_LIST: '/events',
  EVENTS_NEW: '/events/new',
  EVENTS_DETAIL: '/events/:id',
  MAP: '/events/map',
  FAQ: '/faq',
  USER_REQUESTS: '/user_requests',
  USER_REQUEST_DETAILS: '/user_requests/:id',
}

export const getWineDetailPath = (id?: number | string) => `/wines/${id}`
export const getWineryDetailPath = (id?: number | string) => `/winery/${id}`
export const getWineryDetailAddWinePath = (id?: number | string) => `/winery/${id}/add-wine`
export const getPartnerDetailPath = (id?: number | string) => `/partners/${id}`
export const getUserRequestDetailPath = (id?: number | string) => `/user_requests/${id}`
export const getEventDetailPath = (id?: number | string) => `/events/${id}`
