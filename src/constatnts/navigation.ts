import { BarChart3, Beaker, Cog, Users, Wine } from 'lucide-react'
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
  features: generateLinks('features', { hasList: true, hasCreate: true, hasDetail: true }),
  wines: generateLinks('wines', {
    hasList: true,
    hasDetail: true,
    additionalLinks: [
      { titleKey: 'settings', title: 'settings', url: PATHS.WINE_CREATE },
      { titleKey: 'user_propositions', title: 'user_propositions', url: PATHS.WINE_USER_PROPOSITIONS },
      { titleKey: 'tasting', title: 'tasting', url: PATHS.WINE_TASTING },
    ],
  }),
  stats: generateLinks('stats'),
  analysis: generateLinks('analysis', { hasList: true, hasDetail: true }),
}

export const NAV_LINKS = [
  { ...LINKS.dashboard, isActive: false },
  { ...LINKS.users.root, icon: Users, isActive: false, items: [LINKS.users.list] as NavSubItem[] },
  { ...LINKS.features.root, icon: Cog, isActive: false, items: [LINKS.features.list] as NavSubItem[] },
  { ...LINKS.wines.root, icon: Wine, isActive: false, items: [LINKS.wines.list, ...Object.values(LINKS.wines.additional || {})] as NavSubItem[] },
  { ...LINKS.stats.root, icon: BarChart3, isActive: false },
  { ...LINKS.analysis.root, icon: Beaker, isActive: false, items: [LINKS.analysis.list] as NavSubItem[] },
]
