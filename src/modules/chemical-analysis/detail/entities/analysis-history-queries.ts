import { analysisHistoryService } from './analysis-history-service'

export const analysisHistoryQueries = {
  characteristics: (wineId: string | number, date: string) => ({
    queryKey: ['characteristics-history', wineId, date],
    queryFn: () => analysisHistoryService.characteristics(wineId, date),
  }),

  taste: (wineId: string | number, date: string) => ({
    queryKey: ['taste-history', wineId, date],
    queryFn: () => analysisHistoryService.taste(wineId, date),
  }),
}
