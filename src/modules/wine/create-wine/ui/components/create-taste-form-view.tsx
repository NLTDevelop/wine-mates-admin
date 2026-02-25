import { ContentLayout } from '@/layout/components/content-layout'
import { useCreateWineForm } from '../../presenters/useCreateWineForm'
import { WineForm } from './wine-form'
import { useCachedColors } from '@/modules/wine/create/general/presenters/useCachedColors'
import { useCachedWineTypes } from '@/modules/wine/create/general/presenters/useCachedWineTypes'
import { useTranslation } from 'react-i18next'

export const CreateTasteFormView = () => {
  const { t } = useTranslation('wines')

  const { form, isSubmitting, onSubmit } = useCreateWineForm()

  const { cachedColors, isLoading: colorsLoading } = useCachedColors()
  const { cachedWineTypes, isLoading: wineTypesLoading } = useCachedWineTypes()

  return (
    <ContentLayout title={t('creating_taste')}>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
        <WineForm
          form={form as any}
          wineTypes={cachedWineTypes}
          mode="create"
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          cachedColors={cachedColors}
          colorsLoading={colorsLoading}
          wineTypesLoading={wineTypesLoading}
        />
      </div>
    </ContentLayout>
  )
}
