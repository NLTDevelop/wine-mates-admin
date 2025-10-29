import { useTranslation } from 'react-i18next'
import { useFeatures } from '../../presenters/useFeatures'
import { useFeatureColumns } from '../../presenters/useFeatureColumns'
import { NLTDataTable } from '@/UIKit/components/NLTDataTable'
import { ContentLayout } from '@/layout/components/content-layout'
import { useDataTable } from '@/UIKit/components/NLTDataTable/useDataTable'
import { NLTProgress } from '@/UIKit/components/NLTProgress/nlt-progress'

export const FeaturesView = () => {
  const { t } = useTranslation('features')

  const { features, isLoading, isUpdating, onToggle } = useFeatures()

  const columns = useFeatureColumns({ onToggle, isUpdating })

  const { table } = useDataTable(features ?? [], columns)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <NLTProgress className="w-20 h-20 text-secondary" />
      </div>
    )
  }

  return (
    <ContentLayout title={t('feature_management')} description={t('current_statuses')}>
      <NLTDataTable table={table} rowClassname="hover:bg-transparent cursor-none pointer-events-none text-center" ToolBar={null} />
    </ContentLayout>
  )
}
