import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Tags } from 'lucide-react'
import { CreateWineTypeRequest } from '../../entities/types/wine-type'
import { useCreateWineType } from '../../presenters/useCreateWineType'
import { WineTypeForm } from './wine-type-form'
import { BaseWineColor } from '../../../general/entities/types'
import { EmptyState } from '../../../general/ui/components/empty-state'

interface CreateWineTypeSectionProps {
  onCreateWineType: (wineTypeData: CreateWineTypeRequest) => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
  isShowEmptyState?: boolean
}

export const CreateWineTypeSection = ({ onCreateWineType, isLoading = false, cachedColors, isShowEmptyState }: CreateWineTypeSectionProps) => {
  const { t } = useTranslation('wines')

  const { isExpanded, formData, updateFormData, handleCreateWineType, handleCancel, expandForm } = useCreateWineType({
    onCreateWineType,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div>
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
          <h2 className="text-2xl font-bold">{t('types.wine_types')}</h2>
          <Button onClick={expandForm} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('button.add_new_type')}
          </Button>
        </div>
        {isShowEmptyState && <EmptyState type="wine-types" />}
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Tags className="w-5 h-5" />
            {t('types.create_new_type')}
          </h3>
        </CardHeader>

        <WineTypeForm mode="create" formData={formData} onFormDataChange={updateFormData} onSave={handleCreateWineType} onCancel={handleCancel} isLoading={isLoading} cachedColors={cachedColors} />
      </CardContent>
    </Card>
  )
}
