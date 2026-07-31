import { BarChart3, Barrel, Beaker, Cog, HelpCircle, MapPinned, MessagesSquare, Store, Users, Wine, type LucideIcon } from 'lucide-react'
import { generateLinks } from '@/lib/generate-links'
import { PATHS } from '@/navigation/paths'

export interface NavSubItem {
  titleKey: string
  title: string
  url: string
}

export interface NavItem extends NavSubItem {
  icon?: LucideIcon
  items?: NavSubItem[]
  isActive?: boolean
}

export const DEFAULT_PAGINATION_LIMIT = 30
export const EVENT_PAGINATION_LIMIT = 15
export const MAX_SYMBOLS_INPUT_REGULAR = 200
export const MAX_SYMBOLS_INPUT_LARGE = 3000

export const LINKS = {
  dashboard: { titleKey: 'title', url: '/' },
  users: generateLinks('users', { hasList: true, hasDetail: true }),
  features: generateLinks('features', {
    hasList: true,
    hasCreate: true,
    hasDetail: true,
    additionalLinks: [
      { titleKey: 'ai_promts', title: 'ai_promts', url: PATHS.AI_PROMTS },
      { titleKey: 'cuisine', title: 'cuisine', url: PATHS.CUISINE },
    ],
  }),
  wines: generateLinks('wines', {
    hasList: true,
    hasDetail: true,
    additionalLinks: [
      { titleKey: 'settings', title: 'settings', url: PATHS.WINE_CREATE },
      { titleKey: 'user_propositions', title: 'user_propositions', url: PATHS.WINE_USER_PROPOSITIONS },
      { titleKey: 'creating', title: 'creating', url: PATHS.WINE_CREATING },
    ],
  }),
  wineries: generateLinks('wineries', { hasList: true, hasCreate: true, hasDetail: true }),
  partners: generateLinks('partners', { hasList: true, hasCreate: true, hasDetail: true }),
  user_requests: generateLinks('user_requests', { hasList: true, hasDetail: true }),
  stats: generateLinks('stats'),
  analysis: generateLinks('analysis', { hasList: true, hasDetail: true }),
  events: generateLinks('events', {
    hasList: true,
    title: 'events_list',
    hasDetail: true,
  }),
  faq: generateLinks('faq'),
}

export const NAV_LINKS = [
  { ...LINKS.dashboard, isActive: false },
  { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list] as NavSubItem[] },
  { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list, ...Object.values(LINKS.features.additional || {})] as NavSubItem[] },
  { ...LINKS.wines.root, icon: Wine, isActive: false, items: [LINKS.wines.list, ...Object.values(LINKS.wines.additional || {})] as NavSubItem[] },
  { ...LINKS.wineries.root, icon: Barrel, isActive: false, items: [LINKS.wineries.list, LINKS.wineries.create] as NavSubItem[] },
  { ...LINKS.partners.root, icon: Store, isActive: false, items: [LINKS.partners.list, LINKS.partners.create] as NavSubItem[] },
  { ...LINKS.stats.root, icon: BarChart3, isActive: false },
  { ...LINKS.analysis.root, icon: Beaker, isActive: false, items: [LINKS.analysis.list] as NavSubItem[] },
  { ...LINKS.events.root, icon: MapPinned, isActive: false, items: [LINKS.events.list, ...Object.values(LINKS.events.additional || {})] as NavSubItem[] },
  { ...LINKS.user_requests.root, icon: MessagesSquare, isActive: false, items: [LINKS.user_requests.list] as NavSubItem[] },
  { ...LINKS.faq.root, icon: HelpCircle, isActive: false },
]
