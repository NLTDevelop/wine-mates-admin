import { BarChart3, Beaker, Cog, MapPinned, Users, Wine } from 'lucide-react'
import { generateLinks } from '@/lib/generate-links'
import { PATHS } from '@/navigation/paths'

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
  features: generateLinks('features', { hasList: true, hasCreate: true, hasDetail: true, additionalLinks: [{ titleKey: 'ai_promts', title: 'ai_promts', url: PATHS.AI_PROMTS }] }),
  wines: generateLinks('wines', {
    hasList: true,
    hasDetail: true,
    additionalLinks: [
      { titleKey: 'settings', title: 'settings', url: PATHS.WINE_CREATE },
      { titleKey: 'user_propositions', title: 'user_propositions', url: PATHS.WINE_USER_PROPOSITIONS },
      { titleKey: 'creating', title: 'creating', url: PATHS.WINE_CREATING },
    ],
  }),
  stats: generateLinks('stats'),
  analysis: generateLinks('analysis', { hasList: true, hasDetail: true }),
  events: generateLinks('events', {
    hasList: true,
    title: 'events_list',
    hasDetail: true,
  }),
}

export const NAV_LINKS = [
  { ...LINKS.dashboard, isActive: false },
  { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list] as NavSubItem[] },
  { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list, ...Object.values(LINKS.features.additional || {})] as NavSubItem[] },
  { ...LINKS.wines.root, icon: Wine, isActive: false, items: [LINKS.wines.list, ...Object.values(LINKS.wines.additional || {})] as NavSubItem[] },
  { ...LINKS.stats.root, icon: BarChart3, isActive: false },
  { ...LINKS.analysis.root, icon: Beaker, isActive: false, items: [LINKS.analysis.list] as NavSubItem[] },
  { ...LINKS.events.root, icon: MapPinned, isActive: false, items: [LINKS.events.list, ...Object.values(LINKS.events.additional || {})] as NavSubItem[] },
]
