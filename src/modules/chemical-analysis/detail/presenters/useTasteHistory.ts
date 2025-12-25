import { TasteHistoryResponse } from '../entities/types'
import { analysisHistoryQueries } from '../entities/analysis-history-queries'
import { useQuery } from '@tanstack/react-query'

export const useTasteHistory = (wineId: string, date?: string) => {
  return useQuery<TasteHistoryResponse>({
    ...analysisHistoryQueries.taste(wineId, date || ''),
    enabled: !!wineId && !!date,
  })
}
