import { useQuery } from '@tanstack/react-query'
import { CharacteristicsHistoryResponse } from '../entities/types'
import { analysisHistoryQueries } from '../entities/analysis-history-queries'

export const useCharacteristicsHistory = (wineId: string, date?: string) => {
  return useQuery<CharacteristicsHistoryResponse>({
    ...analysisHistoryQueries.characteristics(wineId, date || ''),
    enabled: !!wineId && !!date,
    staleTime: 5 * 60 * 1000,
  })
}
