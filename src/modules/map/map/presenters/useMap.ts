import { useToast } from '@/hooks/shadcn/use-toast'
import { useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'
import { ICoordinate, MapEvent } from '../../events/entities/types'

interface UseMapProps {
  setIsLocating: (value: boolean) => void
  setUserLocation: (value: ICoordinate | null) => void
  setMapCenter: (value: ICoordinate) => void
  isAddingMode: boolean
  setSearchQuery: (value:string)=>void
  setSearchResults:(events: MapEvent[]) => void
  setIsSearching:(value: boolean) => void
  events:MapEvent[]
  setActiveEvent:(event: MapEvent | null) => void
}

export const useMap = ({setIsLocating, setUserLocation, setMapCenter, isAddingMode, setSearchQuery, setSearchResults, setIsSearching, events, setActiveEvent}:UseMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useTranslation('map')

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  //   const { setIsLocating, setUserLocation, setMapCenter, isAddingMode, setSearchQuery, setSearchResults, setIsSearching, events, setActiveEvent } = useMapStore()

  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey || '' })

  const getUserLocation = useCallback(() => {
    setIsLocating(true)

    if (!navigator.geolocation) {
      setIsLocating(false)
      toast({ title: t('not_support_location'), variant: 'destructive' })
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
        toast({ title: t('map_was_moved'), variant: 'success' })
      },
      error => {
        console.error('Geolocation error:', error)
        setIsLocating(false)
        toast({ title: t('location_err'), variant: 'destructive' })
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
            userId: 1,
          },
        })
      })
    }
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

  return { isLoaded, getUserLocation, onMapLoad, handleMapClick, handleSearch, handleSelectSearchResult }
}
