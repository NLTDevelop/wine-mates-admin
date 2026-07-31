/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@/layout/components/content-layout'
import { PATHS } from '@/navigation/paths'
import { usePartnerForm } from '../../presenters/usePartnerForm'
import { PartnerForm } from './partner-form'

export const CreatePartnerView = () => {
  const { t } = useTranslation('partners')
  const navigate = useNavigate()
  const { form, onSubmit, isSubmitting } = usePartnerForm({ mode: 'create' })

  const handleCancel = () => {
    navigate(PATHS.PARTNERS_LIST)
  }

  return (
    <ContentLayout title={t('create_partner')} isGoBack handleGoBack={handleCancel}>
      <div className="mx-auto w-full max-w-4xl">
        <PartnerForm form={form} mode="create" onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </ContentLayout>
  )
}
