import { promtService } from './promt-service'
import { GeminiUpdateConfig, OpenAIUpdateConfig } from './types'

export const promtQueries = {
  snacks: {
    list: () => ({
      queryKey: ['snacks', 'list'],
      queryFn: () => promtService.snacks.list(),
    }),
    update: (params: OpenAIUpdateConfig) => ({
      queryKey: ['snacks', 'update'],
      queryFn: () => promtService.snacks.update(params),
    }),
    reset: () => ({
      queryKey: ['snacks', 'reset'],
      queryFn: () => promtService.snacks.reset(),
    }),
  },
  tasting_note: {
    list: () => ({
      queryKey: ['tasting_note', 'list'],
      queryFn: () => promtService.tasting_note.list(),
    }),
    update: (params: OpenAIUpdateConfig) => ({
      queryKey: ['tasting_note', 'update'],
      queryFn: () => promtService.tasting_note.update(params),
    }),
    reset: () => ({
      queryKey: ['tasting_note', 'reset'],
      queryFn: () => promtService.tasting_note.reset(),
    }),
  },
  blind_tasting_note: {
    list: () => ({
      queryKey: ['blind_tasting_note', 'list'],
      queryFn: () => promtService.blind_tasting_note.list(),
    }),
    update: (params: OpenAIUpdateConfig) => ({
      queryKey: ['blind_tasting_note', 'update'],
      queryFn: () => promtService.blind_tasting_note.update(params),
    }),
    reset: () => ({
      queryKey: ['blind_tasting_note', 'reset'],
      queryFn: () => promtService.blind_tasting_note.reset(),
    }),
  },
  scanner: {
    list: () => ({
      queryKey: ['scanner', 'list'],
      queryFn: () => promtService.scanner.list(),
    }),
    update: (params: GeminiUpdateConfig) => ({
      queryKey: ['scanner', 'update'],
      queryFn: () => promtService.scanner.update(params),
    }),
    reset: () => ({
      queryKey: ['scanner', 'reset'],
      queryFn: () => promtService.scanner.reset(),
    }),
  },
}
