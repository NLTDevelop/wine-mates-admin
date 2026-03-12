import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { MapEvent } from '../../entities/types'
import { IEventFilters } from './types'

interface EventState {
  events: MapEvent[]
  searchResults: MapEvent[]
  currentEvent: MapEvent | null
  filters: IEventFilters
  setEvents: (events: MapEvent[]) => void
  setSearchResults: (results: MapEvent[]) => void
  setCurrentEvent: (event: MapEvent | null) => void
  setFilters: (filters: Partial<EventState['filters']>) => void
  resetFilters: () => void
  updateEvent: (eventId: number, newEvent: MapEvent) => void
}

export const useEventStore = createStoreDevToolsWrapper<EventState>(
  set => ({
    events: [],
    searchResults: [],
    currentEvent: null,

    filters: {
      search: '',
      limit: DEFAULT_PAGINATION_LIMIT,
      page: 1,
      currency: null,
      language: null,
      tastingType: null,
      sortBy: '',
    },

    setEvents: (events: MapEvent[]) => set({ events }, false, 'event/setEvents'),

    setSearchResults: (results: MapEvent[]) => set({ searchResults: results }, false, 'event/setSearchResults'),

    setCurrentEvent: (event: MapEvent | null) => set({ currentEvent: event }, false, 'event/setCurrentEvent'),

    setFilters: (newFilters: Partial<EventState['filters']>) =>
      set(
        (state: EventState) => ({
          filters: { ...state.filters, ...newFilters },
        }),
        false,
        'event/setFilters'
      ),

    resetFilters: () =>
      set(
        {
          filters: {
            search: '',
            limit: DEFAULT_PAGINATION_LIMIT,
            page: 1,
          },
        },
        false,
        'event/resetFilters'
      ),

    updateEvent: (eventId: number, newWine: MapEvent) =>
      set(
        (state: EventState) => ({
          events: state.events.map(e => (e.id === eventId ? newWine : e)),
          currentEvent: state.currentEvent?.id === eventId ? newWine : state.currentEvent,
          searchResults: state.searchResults.map(e => (e.id === eventId ? newWine : e)),
        }),
        false,
        'wine/updateWine'
      ),
  }),

  'EventStore'
)
