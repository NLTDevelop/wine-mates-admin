import { IReview } from '@/modules/wine/list/entities/types/types'
import { IWineForAnalysis } from '../../list/entities/types'

export interface WineAnalysisUIResponse {
  // Шапка з заголтною інфо
  wine: IWineForAnalysis

  // Основні блоки аналізу
  analysis: {
    date: string // "2024-12-20"

    // Візуально-смаковий аналіз
    sensory: ISensory

    //  Хімічний аналіз
    chemical: IChemical

    // Нотатки
    reviews: IReview[]
  }

  // Графіки
  charts: ICharts

  availableDates: string[]
}

export interface IChemical {
  sugarContent: ChemicalValueWithDate
  ph: ChemicalValueWithDate
  alcohol: ChemicalValueWithDate
  volatileAcidity: ChemicalValueWithDate
  totalAcidity: ChemicalValueWithDate

  freeSO2: ChemicalValueWithDate
  totalSO2: ChemicalValueWithDate
  density: ChemicalValueWithDate
  malolactic: boolean
  fermentationTemp: ChemicalValueWithDate
}
export interface ISensory {
  visual: IVisual
  aroma: IAroma
  taste: ITaste
}

export interface ChemicalValue {
  value: number
  unit: string
}

export interface ChemicalValueWithDate extends ChemicalValue {
  date: string
  timestamp?: string
}

export interface ICharts {
  period: {
    type: 'day' | 'month' | 'year'
    value: string
  }
  graphs: ChartGraph[]
}

export interface ChartGraph {
  parameter: ChemicalParameter
  title: string
  unit: string
  data: ChartDataPoint[]
  stats: {
    min: number
    max: number
    delta: number
    current: number
  }
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export type ChemicalParameter = 'sugarContent' | 'ph' | 'alcohol' | 'volatileAcidity' | 'totalAcidity' | 'freeSO2' | 'totalSO2' | 'density' | 'fermentationTemp'

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
}
export interface ITaste {
  taste: IBaseInfo
}

export interface DetailFilters {
  range: ChartRange
  value: string
}

export type ChartRange = 'day' | 'month' | 'year'
