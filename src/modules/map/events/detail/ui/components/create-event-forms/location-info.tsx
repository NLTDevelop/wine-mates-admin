import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import { EventFormData } from '@/modules/map/events/detail/presenters/event-form-schema'

interface LocationInfoProps {
  form: UseFormReturn<EventFormData>
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ form }) => {
  const { t } = useTranslation('events')
  const latitude = form.watch('latitude')
  const longitude = form.watch('longitude')
  const locationLabel = form.watch('locationLabel')

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">{t('selected_location')}:</p>
          <p className="text-sm text-blue-600">{locationLabel}</p>
          <p className="text-xs text-blue-500 mt-1">
            {t('coordinates')}: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  )
}
