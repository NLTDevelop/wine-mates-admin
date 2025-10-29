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

export interface IUserTable {
  id: string
  avatarUrl: IFile | null
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
  birthday: string
  email: string
  wineExperienceLevel: string
  isConfirmed?: boolean
  userFullName?: string
}

export interface ConfirmUserCategoryParams {
  id: string | number
  isConfirmed: boolean
}

export interface UserFilters {
  limit: number
  offset: number
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
