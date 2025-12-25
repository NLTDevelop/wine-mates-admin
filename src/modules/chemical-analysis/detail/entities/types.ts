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
  visual: {
    color: string
    shade: string
    intensity: number
    clarity: number
  }
  aroma: {
    intensity: number
    complexity: number
    notes: string[]
  }
  taste: {
    sweetness: number
    acidity: number
    tannins: number
    body: number
    alcoholLevel: number
    finish: number
    notes: string[]
  }
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
