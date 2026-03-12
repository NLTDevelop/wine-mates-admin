import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { useCreateEventForm } from '../../presenters/useCreateEventForm'
import { EventForm } from './create-event-forms/event-form'
import { useNavigate } from 'react-router-dom'

export const CreateEventView = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('events')
  const { form, /*isSubmitting,*/ onSubmit } = useCreateEventForm()

  return (
    <ContentLayout title={t('creating_event')} isGoBack handleGoBack={() => navigate(-1)}>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
        <EventForm
          form={form}
          mode="create"
          onSubmit={onSubmit}
          // isSubmitting={isSubmitting}
          // wines={WINES}
        />
      </div>
    </ContentLayout>
  )
}
