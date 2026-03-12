import { createStoreDevToolsWrapper } from '@/stores/create-store-devtools-wrapper'
import { ICoordinate, MapEvent } from '../../events/entities/types'
import { mockEvents } from './mock'

export const DEFAULT_CENTER = { lat: 50.4501, lng: 30.5234 }

interface MapState {
  events: MapEvent[]
  activeEvent: MapEvent | null
  eventToDelete: MapEvent | null
  searchResults: MapEvent[]
  searchQuery: string

  isDeleteModalOpen: boolean
  isLoading: boolean
  isSearching: boolean
  isLocating: boolean
  isAddingMode: boolean

  mapCenter: ICoordinate
  userLocation: ICoordinate | null

  setEvents: (events: MapEvent[]) => void
  setActiveEvent: (event: MapEvent | null) => void
  setEventToDelete: (event: MapEvent | null) => void
  setSearchQuery: (value:string)=>void
  setSearchResults: (events: MapEvent[]) => void

  setIsDeleteModalOpen: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  setIsSearching: (value: boolean) => void
  setIsLocating: (value: boolean) => void
  setIsAddingMode: (value: boolean) => void

  setMapCenter: (value: ICoordinate) => void
  setUserLocation: (value: ICoordinate | null) => void
}

export const useMapStore = createStoreDevToolsWrapper<MapState>(
  set => ({
    events: mockEvents,
    // events: [],
    activeEvent: null,
    eventToDelete: null,
    searchResults: [],
    searchQuery: '',

    isDeleteModalOpen: false,
    isLoading:false,
    isSearching: false,
    isLocating: false,
    isAddingMode: false,

    mapCenter: DEFAULT_CENTER,
    userLocation: null,

    setEvents: (events: MapEvent[]) => set({ events }, false, 'map/setEvents'),
    setActiveEvent: (activeEvent: MapEvent | null) => set({ activeEvent }, false, 'map/setActiveEvent'),
    setEventToDelete: (eventToDelete: MapEvent | null) => set({ eventToDelete }, false, 'map/setEventToDelete'),
    setSearchResults: (searchResults: MapEvent[]) => set({ searchResults }, false, 'map/setSearchResults'),
    setSearchQuery: (searchQuery: string) => set({ searchQuery }, false, 'map/setSearchQuery'),

    setIsDeleteModalOpen: isDeleteModalOpen => set({ isDeleteModalOpen }, false, 'map/setActiveEvent'),
    setIsLoading: isLoading => set({ isLoading }, false, 'map/setIsLoading'),
    setIsSearching: isSearching => set({ isSearching }, false, 'map/setActiveEvent'),
    setIsLocating: isLocating => set({ isLocating }, false, 'map/setActiveEvent'),
    setIsAddingMode: isAddingMode => set({ isAddingMode }, false, 'map/setActiveEvent'),

    setMapCenter: mapCenter => set({ mapCenter }, false, 'map/setActiveEvent'),
    setUserLocation: (userLocation: ICoordinate | null) => set({ userLocation }, false, 'map/setActiveEvent'),
  }),
  'MapStore'
)
