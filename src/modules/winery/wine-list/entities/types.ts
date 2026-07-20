import { IFile } from '@/modules/users/entities/IUser'
import { IWineFilters } from '@/modules/wine/list/entities/types/types'

export interface WineListOfWineryResponse {
  count: number
  rows: WineOfWinery[]
}

export interface WineOfWinery {
  id: string
  name?: string
  producer?: string
  vintage?: string
  grapeVariety?: string
  image?: IFile
}

export interface AddWineToWineryParams {
  wineryId: string | number
  wineIds: number[]
}

export interface DeleteWineFromWineryParams {
  wineryId: string | number
  wineIds: number[]
}

export interface WineListFilters {
  limit: number
  page: number
  search?: string
}

export interface WineListEmptyWineryFilters extends IWineFilters {
  wineryId?: number;
}
