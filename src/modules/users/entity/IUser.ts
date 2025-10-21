export const USER_CATEGORIES = {
  WINE_LOVER: 'wine_lover',
  WINE_EXPERT: 'wine_expert',
  WINEMAKER: 'winemaker',
} as const

export type UserCategory = (typeof USER_CATEGORIES)[keyof typeof USER_CATEGORIES]

export interface IUserResponse {
  count: number
  rows: IUserTable[]
}

export interface IUserTable {
  id: string
  image: IFile | null
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
  birthday: string
  email: string
  category: string
  isConfirm?: boolean
  userFullName?: string
}

export interface ConfirmUserCategoryParams {
  id: string | number
  isConfirm: boolean
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
