import { useTranslation } from 'react-i18next'
import { getEventDetails } from '../../presenters/event-details-config'
import { Wine, Info } from 'lucide-react'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Badge } from '@/UIKit/shadcn/ui/badge'
import { IEvent } from '../../entities/types'

interface EventDetailsProps {
  event: IEvent
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  const { t } = useTranslation('events')

  const details = getEventDetails(event)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">{event.theme}</h1>
            <p className="text-sm text-gray-500">{event.restaurantName}</p>
          </div>
          <Badge variant={event.isActive ? 'default' : 'secondary'}>{event.isActive ? t('active_event') : t('inactive')}</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <detail.icon className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">{detail.label}:</span> <span className="text-sm font-medium">{detail.value}</span>
              </div>
            </div>
          ))}
        </div>

        {event.description && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex gap-3">
              <Info className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">{t('description')}</p>
                <p className="text-sm mt-1">{event.description}</p>
              </div>
            </div>
          </div>
        )}

        {event.wineSet && event.wineSet.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Wine className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">{t('wine_set')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.wineSet
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(wineSet => (
                  <div key={wineSet.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm">
                    {wineSet.wine.image?.smallUrl && <img src={wineSet.wine.image.smallUrl} alt="" className="w-5 h-5 rounded-full object-cover" />}
                    <span>{wineSet.wine.name}</span>
                    {wineSet.wine.vintage && <span className="text-gray-400">•</span>}
                    <span className="text-gray-500 text-xs">{wineSet.wine.vintage}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
