export interface StatsTableResponse {
  count: number
  rows: StatsResponse[]
  totalPages: number
}

export interface StatsFilters {
  limit?: number
  page?: number
  year?: number | null
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
  averageUserRating: number
  mostActiveGroup: {
    ageGroup: string
    gender: string
    ratingsCount: number
  }
  highestRatingGroup: {
    ageGroup: string
    gender: string
    averageRating: number
  }
}

export interface AggregatedCellData {
  ratingsCount: number
  averageRating: number
}
