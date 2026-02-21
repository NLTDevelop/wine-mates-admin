import { useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'

type MapMarker = {
  id: number
  position: { lat: number; lng: number }
  title: string
  description: string
}

const markers: MapMarker[] = [
  { id: 1, position: { lat: 50.4501, lng: 30.5234 }, title: 'Маркер 1', description: 'Опис першого маркера' },
  { id: 2, position: { lat: 50.4541, lng: 30.5274 }, title: 'Маркер 2', description: 'Опис другого маркера' },
  { id: 3, position: { lat: 50.448, lng: 30.52 }, title: 'Маркер 3', description: 'Опис третього маркера' },
]

export const MapView = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  })

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100vh' }}
      center={{ lat: 50.4501, lng: 30.5234 }}
      zoom={12}
      options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
      onClick={() => setActiveMarker(null)}
    >
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          onClick={() => setActiveMarker(marker)}
          icon={{ url: '/vineMarker.png', scaledSize: new window.google.maps.Size(50, 60) }}
        />
      ))}

      {activeMarker && (
        <InfoWindow
          position={activeMarker.position}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div style={{ minWidth: '220px' }}>
            <h3 style={{ margin: '0 0 4px 0' }}>{activeMarker.title}</h3>
            <p style={{ margin: 0 }}>{activeMarker.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
