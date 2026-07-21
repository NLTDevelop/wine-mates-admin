/* eslint-disable react/react-in-jsx-scope */
import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'
import { useWineryRegistrationForm } from '../../presenters/useWineryRegistrationForm'
import { WineryRegistrationForm } from './winery-registration-form'

export const CreateWineryView = () => {
  const { t } = useTranslation('winery')
  const { form, isSubmitting, onSubmit, handleCancel } = useWineryRegistrationForm()

  return (
    <ContentLayout title={t('create_winery')} isGoBack handleGoBack={handleCancel}>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
        <WineryRegistrationForm form={form} onSubmit={onSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </ContentLayout>
  )
}
