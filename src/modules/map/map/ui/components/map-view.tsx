import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card } from '@/UIKit/shadcn/ui/card'
import { ScrollArea } from '@/UIKit/shadcn/ui/scroll-area'
import { Search, Edit, Trash2, MapPin, LocateFixed, MousePointer, Calendar, Clock, DollarSign, Users, Phone, Globe } from 'lucide-react'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/UIKit/shadcn/ui/tooltip'
import { useToast } from '@/hooks/shadcn/use-toast'
import { WarningModal } from '@/modals/warningModal'
import { type MapEvent } from '../../../events/entities/types'
import { PATHS } from '@/navigation/paths'
import { mockEvents } from '../../entities/mock'
import { ActiveEvent } from './active-event'
import { SearchInMap } from './search-in-map'
import { ActionsMap } from './actions-map'

const DEFAULT_CENTER = { lat: 50.4501, lng: 30.5234 }

export const MapView = () => {
  const navigate = useNavigate()
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const currentUserId = 1

  const [events, setEvents] = useState<MapEvent[]>(mockEvents)

  const [activeEvent, setActiveEvent] = useState<MapEvent | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<MapEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<MapEvent[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isAddingMode, setIsAddingMode] = useState(false)

  const mapRef = useRef<google.maps.Map | null>(null)
  const { toast } = useToast()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  })

  const getUserLocation = useCallback(() => {
    setIsLocating(true)

    if (!navigator.geolocation) {
      setIsLocating(false)
      toast({
        title: 'Геолокація не підтримується вашим браузером',
        variant: 'destructive',
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(location)
        setMapCenter(location)

        if (mapRef.current) {
          mapRef.current.panTo(location)
          mapRef.current.setZoom(15)
        }

        setIsLocating(false)
        toast({
          title: 'Карту переміщено до вашого місцезнаходження',
          variant: 'success',
        })
      },
      error => {
        console.error('Geolocation error:', error)
        setIsLocating(false)
        toast({
          title: 'Не вдалося визначити місцезнаходження',
          variant: 'destructive',
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [toast])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && isAddingMode) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()

      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        if (status === 'OK' && results && results[0]) {
          address = results[0].formatted_address
        }

        navigate(PATHS.EVENTS_NEW, {
          state: {
            latitude: lat,
            longitude: lng,
            locationLabel: address,
            userId: currentUserId,
          },
        })
      })
    }
  }

  const handleEditEvent = (event: MapEvent) => {
    navigate(`/events/${event.id}/edit`, { state: { event } })
  }

  const handleDeleteClick = (event: MapEvent) => {
    setEventToDelete(event)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      setEvents(events.filter(event => event.id !== eventToDelete.id))
      if (activeEvent?.id === eventToDelete.id) {
        setActiveEvent(null)
      }
      toast({
        title: 'Подію видалено',
        variant: 'destructive',
      })
    }
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const results = events.filter(
      event =>
        event.theme.toLowerCase().includes(query.toLowerCase()) ||
        event.restaurantName.toLowerCase().includes(query.toLowerCase()) ||
        (event.speakerName && event.speakerName.toLowerCase().includes(query.toLowerCase()))
    )
    setSearchResults(results)
    setIsSearching(true)
  }

  const handleSelectSearchResult = (event: MapEvent) => {
    setActiveEvent(event)
    if (mapRef.current) {
      mapRef.current.panTo({ lat: event.latitude, lng: event.longitude })
      mapRef.current.setZoom(15)
    }
    setIsSearching(false)
    setSearchQuery('')
  }

  const resetToDefaultLocation = () => {
    setMapCenter(DEFAULT_CENTER)
    if (mapRef.current) {
      mapRef.current.panTo(DEFAULT_CENTER)
      mapRef.current.setZoom(12)
    }
    toast({
      title: 'Карту переміщено до Києва',
      variant: 'default',
    })
  }

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Завантаження карти...</p>
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
        {events.map(event => (
          <Marker key={event.id} position={{ lat: event.latitude, lng: event.longitude }} onClick={() => setActiveEvent(event)} icon={'/icons/event_point.png'} />
        ))}

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
            title="Ваше місцезнаходження"
          />
        )}

        {activeEvent && (
          <ActiveEvent activeEvent={activeEvent} setActiveEvent={setActiveEvent} handleEditEvent={handleEditEvent} handleDeleteClick={handleDeleteClick} />
        )}
      </GoogleMap>

      <WarningModal
        title="Видалити подію?"
        description={`Ви впевнені, що хочете видалити подію "${eventToDelete?.theme}"? Ця дія незворотня.`}
        actionTitle="Видалити"
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
