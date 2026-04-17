import { useCallback } from 'react'
import { eventsService } from '../entities/events-service'

export interface IOption {
  value: string
  label: string
}

export const useWineListOptions = () => {
  const fetchWineOptions = useCallback(async (search?: string, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit

    const response = await eventsService.search({ query: search || '', limit, offset })

    const wines = response.rows || []
    const totalCount = response.count || 0

    const options = wines.map((wine: any) => {
      const label = [wine.name, wine.grapeVariety, wine.vintage].filter(Boolean).join(', ') || wine.name || wine.producer || 'Unknown wine'

      return { value: wine.id.toString(), label }
    })

    return { options, hasMore: offset + limit < totalCount, totalCount }
  }, [])

  return { fetchWineOptions }
}
