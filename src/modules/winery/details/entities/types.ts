import { WineImage } from '@/modules/wine/list/entities/types/types'
import { WineriesType } from '../../list/entities/types'
import { IAvatar } from '@/modules/users/entities/IUser'

export interface IWineryDetail {
  id: number
  name: string
  foundedYear: number
  description: string
  links: string[]
  createdAt: string
  country: IOption
  region: IOption
  mainPhoto: WineImage
  gallery: WineImage[]
  application: IApplication
  members: IMember[]
}

interface IOption {
  id: number
  name: string
}

interface IApplication {
  id: number
  status: WineriesType
  rejectionReason?: string
}

export const MEMBER_ROLE = { OWNER: 'OWNER' } as const
export type MembersType = (typeof MEMBER_ROLE)[keyof typeof MEMBER_ROLE]

interface IMember {
  id: number
  firstName: string
  lastName: string
  avatar: IAvatar
  role: MembersType
}

export interface ConfirmWineryParams {
  id: string | number
  body: IConfirmWineryBody
}

export interface AddWineToWineryParams {
  wineryId: string | number
  wineIds: number[]
}

export interface IConfirmWineryBody {
  status: WineriesType
  rejectionReason?: string
}

