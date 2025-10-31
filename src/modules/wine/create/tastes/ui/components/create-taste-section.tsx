import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Palette } from 'lucide-react'
import { useCreateTaste } from '../../presenters/useCreateTaste'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'

interface CreateTasteSectionProps {
  onCreateTaste: (tasteData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

export const CreateTasteSection = ({ onCreateTaste, isLoading = false }: CreateTasteSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreateTaste, updateFormData, handleCreateTaste, handleCancel, expandForm } = useCreateTaste({
    onCreateTaste,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('tastes.tastes')}</h2>
        <Button onClick={expandForm}>
          <Plus className="w-4 h-4 mr-2" />
          {t('button.create_new_taste')}
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
            {t('tastes.create_new_taste')}
          </h3>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('tastes.taste_name_ua')} *</label>
            <Input value={formData.label} onChange={e => updateFormData({ label: e.target.value })} placeholder={t('tastes.taste_name_ua')} className="w-full" autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('tastes.taste_name_en')} *</label>
            <Input value={formData.labelEn} onChange={e => updateFormData({ labelEn: e.target.value })} placeholder={t('tastes.taste_name_en')} className="w-full" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">{t('colors.base_color')} *</label>
          <div className="flex items-center gap-4">
            <ColorPicker value={formData.value} onChange={color => updateFormData({ value: color })} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 flex-col sm:flex-row">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateTaste} disabled={!canCreateTaste || isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
