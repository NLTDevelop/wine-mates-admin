import { GoogleMap, Marker } from '@react-google-maps/api'
import { useMapStore } from '../../entities/map-store'
import { useMapActions } from '@/modules/map/general/presenters/useMapState'
import { useTranslation } from 'react-i18next'
import { Card } from '@/UIKit/shadcn/ui/card'
import { WarningModal } from '@/modals/warningModal'
import { ActiveEvent, SearchInMap, ActionsMap } from '..'

export const MapView = () => {
  const { t } = useTranslation('map')
  const { t: event } = useTranslation('events')

  const {
    events,
    eventToDelete,
    setEventToDelete,
    activeEvent,
    setActiveEvent,
    setIsDeleteModalOpen,
    searchQuery,
    searchResults,
    isAddingMode,
    isDeleteModalOpen,
    isSearching,
    setIsAddingMode,
    userLocation,
    mapCenter,
    isLocating,
  } = useMapStore()

  const { mapHook, eventsHook } = useMapActions()
  const { isLoaded, getUserLocation, onMapLoad, handleMapClick, handleSearch, handleSelectSearchResult } = mapHook
  const { handleEditEvent, handleDeleteClick, handleDeleteConfirm } = eventsHook

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">{t('loading_map')}</p>
        </div>
      </div>
    )

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-32px)]">
        <Card className="p-4 shadow-lg">
          <div className="space-y-4">
            <SearchInMap searchQuery={searchQuery} handleSearch={handleSearch} isSearching={isSearching} searchResults={searchResults} handleSelectSearchResult={handleSelectSearchResult} />
            <ActionsMap getUserLocation={getUserLocation} isLocating={isLocating} setIsAddingMode={setIsAddingMode} isAddingMode={isAddingMode} />
          </div>
        </Card>
      </div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={12}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {events.map(event => {
          return <Marker key={event.id} position={{ lat: event.latitude, lng: event.longitude }} onClick={() => setActiveEvent(event)} icon={'/icons/event_point.png'} />
        })}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            }}
            title={t('your_location')}
          />
        )}
        {activeEvent && <ActiveEvent activeEvent={activeEvent} setActiveEvent={setActiveEvent} handleEditEvent={handleEditEvent} handleDeleteClick={handleDeleteClick} />}
      </GoogleMap>

      <WarningModal
        title={event('delete_modal_title')}
        description={event('delete_modal_desc', { slug: eventToDelete?.theme })}
        actionTitle={event('button.delete')}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setEventToDelete(null)
        }}
        onSubmit={handleDeleteConfirm}
      />
    </div>
  )
}
