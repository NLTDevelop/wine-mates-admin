import { useTranslation } from 'react-i18next'
import { useCreateColorGroup } from '../../presenters/useCreateColorGroup'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Palette } from 'lucide-react'
import { CreateWineColorParams } from '../../entities/types/color-types'
import { ColorGroupFormFields } from './color-group-form-fields'

interface CreateColorGroupSectionProps {
  onCreateGroup: (groupData: Partial<CreateWineColorParams>) => void
  isLoading?: boolean
}

export const CreateColorGroupSection = ({ onCreateGroup, isLoading = false }: CreateColorGroupSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateGroup, updateFormData, handleCreateGroup, handleCancel, expandForm } = useCreateColorGroup({
    onCreateGroup,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('colors.colors')}</h2>
        <Button onClick={expandForm} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {t('button.create_new_color')}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('colors.create_new_color')}
          </h3>
        </CardHeader>

        <ColorGroupFormFields formData={formData} onFormDataChange={updateFormData} isLoading={isLoading} />

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
