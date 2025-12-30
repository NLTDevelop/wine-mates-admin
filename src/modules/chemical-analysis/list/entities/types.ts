import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { WineImage } from '@/modules/wine/list/entities/types/types'

export interface WineForAnalysisResponse {
  rows: IWineForAnalysis[]
  totalPages: number
  count: number
}

export interface IWineForAnalysis {
  id?: string
  typeName?: string
  color?: BaseWineColor
  capacityName?: string
  grapeVariety?: string
  name?: string
  vintage?: number
  wintage?: number
  image?: WineImage
}
