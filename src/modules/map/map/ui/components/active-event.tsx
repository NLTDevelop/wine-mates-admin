import { MapEvent } from '@/modules/map/events/entities/types'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { Button } from '@/UIKit/shadcn/ui/button'
import { InfoWindow } from '@react-google-maps/api'
import { Calendar, Clock, DollarSign, Edit, Globe, Phone, Trash2, Users } from 'lucide-react'

interface ActiveEventProps{
    activeEvent: MapEvent
    setActiveEvent: (value: MapEvent | null) => void
    handleEditEvent: (eventId: number) => void
    handleDeleteClick: (eventId: number) => void
}


export const ActiveEvent = ({activeEvent, setActiveEvent, handleEditEvent, handleDeleteClick}:ActiveEventProps) => {
  return (
        <InfoWindow position={{ lat: activeEvent.latitude, lng: activeEvent.longitude }} onCloseClick={() => setActiveEvent(null)}>
            <div style={{ minWidth: '320px' }} className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge>
                    <span className="ml-1">{activeEvent.tastingType}</span>
                  </Badge>
                  {activeEvent.isOnline && (
                    <Badge variant="outline" className="bg-green-50">
                      <Globe className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  )}
                </div>
                {!activeEvent.isActive && <Badge variant="destructive">Неактивна</Badge>}
              </div>

              <h3 className="font-bold text-lg mb-1">{activeEvent.theme}</h3>
              <p className="text-sm text-gray-600 mb-2">{activeEvent.restaurantName}</p>
              <p className="text-sm text-gray-500 mb-3">{activeEvent.locationLabel}</p>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{activeEvent.eventDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{activeEvent.eventTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>
                    {activeEvent.price} {activeEvent.currency}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{activeEvent.seats} місць</span>
                </div>
              </div>

              {activeEvent.speakerName && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{activeEvent.speakerName}</span>
                  <Badge variant="outline">{activeEvent.language}</Badge>
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{activeEvent.phoneNumber}</span>
              </div>

              <div className="flex gap-2 justify-end mt-3 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => handleEditEvent(activeEvent.id)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Редагувати
                </Button>
                <Button size="sm" variant="delete" onClick={() => handleDeleteClick(activeEvent.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Видалити
                </Button>
              </div>
            </div>
          </InfoWindow>
  )
}
