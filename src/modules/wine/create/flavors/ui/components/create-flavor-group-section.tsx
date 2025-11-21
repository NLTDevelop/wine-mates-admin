import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Flower } from 'lucide-react'
import { useCreateFlavorGroup } from '../../presenters/useCreateFlavorGroup'
import { CreateWineAromaGroupRequest } from '../../entities/types/flavor-types'
import { FlavorGroupFormFields } from './flavor-group-form-field'
import { BaseWineColor } from '../../../general/entities/types'

interface CreateFlavorGroupSectionProps {
  onCreateGroup: (groupData: CreateWineAromaGroupRequest) => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
}

export const CreateFlavorGroupSection = ({ onCreateGroup, isLoading = false, cachedColors }: CreateFlavorGroupSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateGroup, updateFormData, handleCreateGroup, handleCancel, expandForm } = useCreateFlavorGroup({
    onCreateGroup,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div>
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
          <h2 className="text-2xl font-bold">{t('flavors.flavors')}</h2>
          <Button onClick={expandForm} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('button.add_new_aroma')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Flower className="w-5 h-5" />
            {t('flavors.create_new_group')}
          </h3>
        </CardHeader>

        <FlavorGroupFormFields formData={formData} onFormDataChange={updateFormData} isLoading={isLoading} cachedColors={cachedColors} />

        <div className="flex justify-end gap-2 flex-col sm:flex-row mt-4">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateGroup} disabled={!canCreateGroup || isLoading}>
            <Plus className="w-4 h-4" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
