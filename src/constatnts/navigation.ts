import { BarChart3, Cog, Users, Wine, MapPinned } from 'lucide-react'

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

// export const LINKS = {
//   dashboard: { titleKey: 'title', url: '/' },

//   users: generateLinks('users', { hasList: true, hasDetail: true }),
//   features: generateLinks('features', { hasList: true, hasCreate: true, hasDetail: true }),
//   wines: generateLinks('wines', { hasList: true, hasCreate: true, hasDetail: true }),
//   stats: generateLinks('stats'),

//   // eventsRoot: generateLinks('events'),
//   // places: generateLinks('events/places', { hasPlace: true }),
//   events: generateLinks('events/events', { hasEvent: true, hasMap: true, hasPlace: true }),
//   // map: generateLinks('events/map'),
// }

// export const NAV_LINKS = [
//   { ...LINKS.dashboard, isActive: false },
//   { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list] as NavSubItem[] },
//   { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list] as NavSubItem[] },
//   { ...LINKS.wines.root, icon: Wine, isActive: false, items: [LINKS.wines.create, LINKS.wines.list] as NavSubItem[] },
//   { ...LINKS.stats.root, icon: BarChart3, isActive: false },
//   {
//     ...LINKS.events.root,
//     icon: MapPinned,
//     items: [LINKS.events.places, LINKS.events.events!, LINKS.events.map],
//   },
//   // {
//   //   ...LINKS.eventsRoot.root,
//   //   icon: MapPinned,
//   //   items: [LINKS.places.places, LINKS.events.events!, LINKS.map.map],
//   // },
// ]

export const LINKS = {
  dashboard: { titleKey: 'title', url: '/' },
  users: generateLinks('users', { hasList: true, hasDetail: true }),
  features: generateLinks('features', { hasList: true, hasCreate: true, hasDetail: true }),
  wines: generateLinks('wines', { hasList: true, hasCreate: true, hasDetail: true }),
  stats: generateLinks('stats'),
  events: generateLinks('events', { hasEvent: true, hasPlace: true, hasMap: true }),
}

export const NAV_LINKS = [
  { ...LINKS.dashboard, isActive: false },
  { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list!] },
  { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list!] },
  { ...LINKS.wines.root, icon: Wine, isActive: false, items: [LINKS.wines.create!, LINKS.wines.list!] },
  { ...LINKS.stats.root, icon: BarChart3, isActive: false },
  {
    ...LINKS.events.root,
    icon: MapPinned,
    items: [LINKS.events.places!, LINKS.events.events!, LINKS.events.map!],
  },
]
