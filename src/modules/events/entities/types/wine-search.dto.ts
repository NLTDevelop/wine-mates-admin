export interface WineSearchParams {
  query?: string
  limit?: number
  offset?: number
}
export interface WineSearchResponse {
  rows: Array<{
    id: number
    name: string
    producer: string
    vintage: number
  }>
  count: number
  totalPages: number
}
