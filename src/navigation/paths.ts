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
  WINE_USER_PROPOSITIONS: '/wines/user-propositions',
  WINE_CREATING: '/wines/creating',
  STATS: '/stats',
  ANALYSIS: '/analysis',
  ANALYSIS_DETAIL: '/analysis/:id',
  AI_PROMTS: '/features/ai-promts',
  EVENTS_LIST: '/events',
  EVENTS_NEW: '/events/new',
  EVENTS_DETAIL: '/events/:id',
  MAP: '/events/map',
  FAQ: '/faq',
}

export const getWineDetailPath = (id?: number | string) => `/wines/${id}`
export const getEventDetailPath = (id?: number | string) => `/events/${id}`
