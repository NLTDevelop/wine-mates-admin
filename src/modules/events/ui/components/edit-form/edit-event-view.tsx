import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@/layout/components/content-layout'
import { Loader2 } from 'lucide-react'
import { EventForm } from './event-form'
import { useEditEventForm } from '@/modules/events/presenters/useEditEventForm'

export const EditEventView = () => {
  const { t } = useTranslation('events')
  const { form, isSubmitting, isLoading, onSubmit, event, resetForm } = useEditEventForm()

  if (isLoading) {
    return (
      <ContentLayout title={t('loading_event')}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </ContentLayout>
    )
  }

  if (!event) {
    return (
      <ContentLayout title={t('event_not_found')}>
        <div className="text-center py-12">
          <p className="text-gray-500">{t('event_not_found_description')}</p>
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title={t('editing_event')}>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
        <EventForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} onCancel={resetForm} />
      </div>
    </ContentLayout>
  )
}
