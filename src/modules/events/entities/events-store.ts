import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { IEvent, IEventFilters } from './types'

interface EventState {
  events: IEvent[]
  searchResults: IEvent[]
  currentEvent: IEvent | null
  filters: IEventFilters
  setEvents: (events: IEvent[]) => void
  setSearchResults: (results: IEvent[]) => void
  setCurrentEvent: (event: IEvent | null) => void
  setFilters: (filters: Partial<EventState['filters']>) => void
  resetFilters: () => void
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
      maxPrice: null,
      minPrice: null,
      dateTo: null,
      dateFrom: null,
      isActive: null,
      countryId: null,
    },

    setEvents: (events: IEvent[]) => set({ events }, false, 'event/setEvent'),

    setSearchResults: (results: IEvent[]) => set({ searchResults: results }, false, 'event/setSearchResults'),

    setCurrentEvent: (event: IEvent | null) => set({ currentEvent: event }, false, 'event/setCurrentEvent'),

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
  }),

  'WineStore'
)
