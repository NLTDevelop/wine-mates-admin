import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Flower } from 'lucide-react'
import { useCreateFlavorGroup } from '../../presenters/useCreateFlavorGroup'

interface CreateFlavorGroupSectionProps {
  onCreateGroup: (groupData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

export const CreateFlavorGroupSection = ({ onCreateGroup, isLoading = false }: CreateFlavorGroupSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateGroup, updateFormData, handleCreateGroup, handleCancel, expandForm } = useCreateFlavorGroup({
    onCreateGroup,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('flavors.flavors')}</h2>
        <Button onClick={expandForm} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {t('button.create_new_aroma_group')}
        </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_ua')} *</label>
            <Input value={formData.label} onChange={e => updateFormData({ label: e.target.value })} placeholder={t('flavors.group_name_ua')} className="w-full" autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('flavors.group_name_en')} *</label>
            <Input value={formData.labelEn} onChange={e => updateFormData({ labelEn: e.target.value })} placeholder={t('flavors.group_name_en')} className="w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-2 flex-col sm:flex-row">
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
