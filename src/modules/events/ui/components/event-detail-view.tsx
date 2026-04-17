import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEventDetails } from '../../presenters/useEventDetails'
import { useEditEventForm } from '../../presenters/useEditEventForm'
import { ContentLayout } from '@/layout/components/content-layout'
import { PATHS } from '@/navigation/paths'
import { EventDetails } from './event-details'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { SkeletonWinePalette } from '@/modules/wine/create/general/ui/components/skeleton-wine-palette'
import { EventForm } from './edit-form/event-form'

export const EventDetailView = () => {
  const { t } = useTranslation('events')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'

  const { event, isLoading, error } = useEventDetails()

  const { form, isSubmitting, onSubmit, resetForm } = useEditEventForm()

  if (isEditMode && !isLoading && event) {
    return (
      <ContentLayout title={t('editing_event')} isGoBack handleGoBack={() => navigate(PATHS.EVENTS_LIST)}>
        <div className="mx-auto sm:px-4 px-1 py-1 max-w-4xl">
          <EventForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} onCancel={resetForm} event={event} />
        </div>
      </ContentLayout>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
          <SkeletonWinePalette />
        </CardContent>
      </Card>
    )
  }

  if (error || !event) {
    return (
      <ContentLayout title={t('event_not_found')}>
        <div className="text-center py-12">
          <p className="text-gray-500">{t('event_not_found_description')}</p>
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title={event.theme} isGoBack handleGoBack={() => navigate(PATHS.EVENTS_LIST)}>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
        <EventDetails event={event} />
      </div>
    </ContentLayout>
  )
}
