import {
  Image,
  Layers,
  LayoutDashboard,
  List,
  Megaphone,
  Newspaper,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'

export const DEFAULT_PAGINATION_LIMIT = 30
export const MAX_SYMBOLS_INPUT_REGULAR = 200
export const MAX_SYMBOLS_INPUT_LARGE = 3000

export const LINKS = {
  dashboard: {
    titleKey: 'dashboard',
    url: '/',
  },
  orders: {
    titleKey: 'orders',
    url: '/orders',
    detailUrl: (id: string | number) => `/orders/${id}`,
  },
  users: {
    titleKey: 'users',
    url: '/users',
    detailUrl: (id: string | number) => `/users/${id}`,
  },
  categories: {
    titleKey: 'categories',
    url: '/categories',
    create: '/categories/create',
    detailUrl: (id: string | number) => `/categories/${id}`,
  },
  goods: {
    titleKey: 'goods',
    url: '/goods',
    create: '/goods/create',
    detailUrl: (id: string | number) => `/goods/${id}`,
  },
  goodsGrope: {
    titleKey: 'goodsGrope',
    url: '/goodsGrope',
    create: '/goodsGrope/create',
    detailUrl: (id: string | number) => `/goodsGrope/${id}`,
  },
  sale: {
    titleKey: 'sale',
    url: '/sale',
    create: '/sale/create',
    detailUrl: (id: string | number) => `/sale/${id}`,
  },
  promotions: {
    titleKey: 'promotions',
    url: '/promotions',
    create: '/promotions/create',
    detailUrl: (id: string | number) => `/promotions/${id}`,
  },
  news: {
    titleKey: 'news',
    url: '/news',
    create: '/news/create',
    detailUrl: (id: string | number) => `/news/${id}`,
  },
  banners: {
    titleKey: 'banners',
    url: '/banners',
    create: '/banners/create',
    detailUrl: (id: string | number) => `/banners/${id}`,
  },
}

export const NAV_LINKS = [
  {
    ...LINKS.dashboard,
    icon: LayoutDashboard,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.orders,
    icon: ShoppingCart,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.users,
    icon: Users,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.categories,
    icon: List,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.goods,
    icon: Package,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.goodsGrope,
    icon: Layers,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.sale,
    icon: Tag,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.promotions,
    icon: Megaphone,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.news,
    icon: Newspaper,
    isActive: false,
    items: [],
  },
  {
    ...LINKS.banners,
    icon: Image,
    isActive: false,
    items: [],
  },
]
