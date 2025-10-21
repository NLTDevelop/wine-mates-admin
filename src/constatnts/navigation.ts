import { Clipboard, Users, Wine } from 'lucide-react'

export const DEFAULT_PAGINATION_LIMIT = 30
export const MAX_SYMBOLS_INPUT_REGULAR = 200
export const MAX_SYMBOLS_INPUT_LARGE = 3000

export const LINKS = {
  dashboard: {
    titleKey: 'title',
    url: '/',
  },
  users: {
    titleKey: 'users',
    url: '/users',
    detailUrl: (id: string | number) => `/users/${id}`,
    list: { titleKey: 'list', title: 'list', url: '/users' },
  },
  wines: {
    titleKey: 'wines',
    url: '/wines',
    create: '/wines/create',
    detailUrl: (id: string | number) => `/wines/${id}`,
    list: { titleKey: 'list', title: 'list', url: '/wines' },
  },
  reviews: {
    titleKey: 'reviews',
    url: '/reviews',
    create: '/reviews/create',
    detailUrl: (id: string | number) => `/reviews/${id}`,
  },
}

export const NAV_LINKS = [
  {
    ...LINKS.dashboard,
    isActive: false,
  },
  {
    ...LINKS.users,
    icon: Users,
    isActive: false,
    items: [LINKS.users.list],
  },
  {
    ...LINKS.wines,
    icon: Wine,
    isActive: false,
    items: [LINKS.wines.list],
  },
  {
    ...LINKS.reviews,
    icon: Clipboard,
    isActive: false,
    items: [],
  },
]
