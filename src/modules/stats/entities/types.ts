export interface StatsTableResponse {
  count: number
  rows: StatsResponse[]
  totalPages: number
}

export interface StatsFilters {
  limit: number
  page: number
  year?: number
  gender?: 'male' | 'female'
}
export interface WineRating {
  ratingsCount: number
  averageRating: number
}

export interface AgeGroupData {
  [key: string]: WineRating
}

export interface GenderData {
  male: AgeGroupData
  female: AgeGroupData
}

export interface StatsResponse {
  year: number
  data: GenderData
}

export interface IOverallStats {
  totalRatings: number
  averageRating: number
  mostActive: {
    ageGroup: string
    gender: string
    count: number
  }
  highestRating: {
    ageGroup: string
    gender: string
    rating: number
  }
}

export interface AggregatedCellData {
  ratingsCount: number
  averageRating: number
}
