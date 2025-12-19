import { ContentLayout } from '@/layout/components/content-layout'
import { useTranslation } from 'react-i18next'

export const DashboardView = () => {
  const { t } = useTranslation('navigation')


  return (
    <ContentLayout title={t('dashboard')}>
      <p>Content</p>
    </ContentLayout>
  )
}
