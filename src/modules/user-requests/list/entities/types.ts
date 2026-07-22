import { IAvatar } from '@/modules/users/entities/IUser'

export interface UserRequestsResponse {
  rows: IUserRequest[]
  totalPages: number
  count: number
}

export interface UserRequestFilters {
  limit: number
  page: number
  search?: string
  status?: UserRequestType
}

export const USER_REQUESTS_STATUS = { OPEN: 'OPEN', IN_PROGRESS: 'IN_PROGRESS', CLOSED: 'CLOSED' } as const
export type UserRequestType = (typeof USER_REQUESTS_STATUS)[keyof typeof USER_REQUESTS_STATUS] | null

export interface IUserRequest {
  id: number
  subject: string
  description: string
  status: UserRequestType
  adminComment: string
  closedAt: string
  createdAt: string
  user: IUserOfUserRequest
  photos: UserRequestFile
  files: UserRequestFile
  userId?: number
}

export interface IUserOfUserRequest {
  id: number
  avatar: IAvatar | null
  firstName: string
  lastName: string
  email: string
}

export interface UserRequestFile {
  id: number
  size: number
  mimetype: string
  name: string
  originalName: string
  smallUrl: string
  mediumUrl: string
  originalUrl: string
  createdAt: string
}
