
export const USER_CATEGORIES = {
  WINE_LOVER: 'lover',
  WINE_EXPERT: 'expert',
  WINEMAKER: 'creator',
} as const

export type UserCategory = (typeof USER_CATEGORIES)[keyof typeof USER_CATEGORIES]

export interface IUserResponse {
  count: number
  rows: IUserTable[]
  totalPages: number
}

export interface IAvatar {
    name: string,
    originalName: string,
    mimetype: string,
    size: number,
    smallUrl: string,
    mediumUrl: string,
    originalUrl: string
}

export interface IUserTable {
  id: string
  avatar: IAvatar | null
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
  birthday: string
  email: string
  wineExperienceLevel: string
  isConfirmed?: boolean
  userFullName?: string
  occupation?: string
  wineryName?: string | null
  gender?: string
  bio?: string
  language?: string
  city?: string
  roles?: Array<{
    id: number
    name: string
  }>
}

export interface IUserDetail extends IUserTable {
  occupation: string
  wineryName: string | null
  gender: string
  bio: string
  language: string
  city: string
  roles: Array<{
    id: number
    name: string
  }>
}

export interface ConfirmUserCategoryParams {
  id: string | number
  isConfirmed: boolean
}

export interface UserFilters {
  limit: number
  page: number
  search?: string
  category?: string
}

export interface IFile {
  name?: string
  smallUrl: string
  mediumUrl: string
  originUrl: string
  download: string | null
  mimetype: string
  size: number
}
