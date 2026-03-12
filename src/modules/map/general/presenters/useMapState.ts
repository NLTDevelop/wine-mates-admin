import { useEvents } from '../../events/presenters/useEvents'
import { useMapStore } from '../../map/entities/map-store'
import { useMap } from '../../map/presenters/useMap'

export const useMapActions  = () => {
  const {
    events,
    setEvents,
    eventToDelete,
    setEventToDelete,
    activeEvent,
    setActiveEvent,
    setIsDeleteModalOpen,
    isAddingMode,
    setIsLocating,
    setUserLocation,
    setMapCenter,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
  } = useMapStore()

  const mapHook = useMap({
    setIsLocating,
    setUserLocation,
    setMapCenter,
    isAddingMode,
    setSearchQuery,
    setSearchResults,
    setIsSearching,
    events,
    setActiveEvent,
  })

  const eventsHook = useEvents({ setEventToDelete, setIsDeleteModalOpen, eventToDelete, setEvents, events, activeEvent, setActiveEvent })

  return { mapHook, eventsHook }
}
