import { ReviewUser } from '@/modules/wine/list/entities/types/types'
import { IWineForAnalysis } from '../../list/entities/types'

export interface IChemicalMeasure {
  id?: string
  value: number
  date: string
}

export interface IWineAnalysisDetail extends IWineForAnalysis {
  sugarContent: IChemicalMeasure[]
  ph: IChemicalMeasure[]
  volatileAcidity: IChemicalMeasure[]
  totalAcidity: IChemicalMeasure[]
  alcohol: IChemicalMeasure[]
  freeSO2: number
  totalSO2: number
  density: number
  malolactic: boolean
  fermentationTemp: number
  analysisDates: string[]
  sensoryAnalysis: TasteHistoryResponse
}

//taste history (look, smell, taste)
export interface TasteHistoryResponse {
  visual: IVisual
  aroma: IAroma
  taste: ITaste
  analysisDates?: string[]
}

export interface IBaseInfo {
  id: string
  colorHex: string
  name?: string
}

export type IBaseInfoWithoutColor = Omit<IBaseInfo, 'colorHex'>

export interface IVisual {
  color: IBaseInfo
  shade?: IBaseInfo
  tone?: IBaseInfo
  mousse?: number
  perlage?: number
}
export interface IAroma {
  aromaGroup: IBaseInfo
  aromaSubGroup: IBaseInfo
  aromas: IBaseInfoWithoutColor[]
  note: string
}
export interface ITaste {
  taste: IBaseInfo
  note: string
}

//Characteristics history
export interface CharacteristicsHistoryResponse {
  range: 'day' | 'month' | 'year'
  selectedDate: string
  data: ChartDataItem[]
  xAxisLabels: string[]
}

export interface ChartDataItem {
  timestamp: string
  sugarContent?: number
  ph?: number
  alcohol?: number
  volatileAcidity?: number
  totalAcidity?: number
}

//review
export interface AnalysisReviewsResponse {
  count: number
  totalPages: number
  rows: IAnalysisReview[]
}

export interface IAnalysisReview {
  id: number
  userRating: number
  expertRating: number
  review: string
  createdAt: string
  user: ReviewUser
}
