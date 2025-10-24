import { Clipboard, Cog, Users, Wine } from 'lucide-react'

import { generateLinks } from '@/lib/generate-links'

export interface NavSubItem {
  titleKey: string
  title: string
  url: string
}

export interface NavItem extends NavSubItem {
  icon?: React.ForwardRefExoticComponent<any>
  items?: NavSubItem[]
  isActive?: boolean
}

export const DEFAULT_PAGINATION_LIMIT = 30
export const MAX_SYMBOLS_INPUT_REGULAR = 200
export const MAX_SYMBOLS_INPUT_LARGE = 3000

export const LINKS = {
  dashboard: { titleKey: 'title', url: '/' },
  users: generateLinks('users', { hasList: true, hasDetail: true }),
  features: generateLinks('features', { hasList: true, hasCreate: true, hasDetail: true }),
  wines: generateLinks('wines', { hasList: true, hasCreate: true, hasDetail: true }),
  reviews: generateLinks('reviews', { hasList: true, hasCreate: true, hasDetail: true }),
}

export const NAV_LINKS = [
  { ...LINKS.dashboard, isActive: false },
  { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list] as NavSubItem[] },
  { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list] as NavSubItem[] },
  { ...LINKS.wines.root, icon: Wine, isActive: false, items: [ LINKS.wines.create] as NavSubItem[] },
  { ...LINKS.reviews.root, icon: Clipboard, isActive: false, items: [] as NavSubItem[] },
]
