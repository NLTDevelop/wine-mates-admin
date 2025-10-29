import { useTranslation } from 'react-i18next'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Plus, Palette } from 'lucide-react'
import { ColorPicker } from '@/UIKit/shadcn/ui/color-picker'
import { useState } from 'react'

interface CreateCategorySectionProps {
  onCreateCategory: (categoryData: { value: string; label: string; labelEn: string }) => void
  isLoading?: boolean
}

export const CreateCategorySection = ({ onCreateCategory, isLoading = false }: CreateCategorySectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    value: '',
    label: '',
    labelEn: '',
  })

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleCreateCategory = () => {
    if (canCreateCategory) {
      onCreateCategory(formData)
      setFormData({ value: '', label: '', labelEn: '' })
      setIsExpanded(false)
    }
  }

  const handleCancel = () => {
    setFormData({ value: '', label: '', labelEn: '' })
    setIsExpanded(false)
  }

  const canCreateCategory = formData.value && formData.label && formData.labelEn

  if (!isExpanded) {
    return (
      <div className="flex justify-center">
        <Button onClick={() => setIsExpanded(true)}>
          <Plus className="w-5 h-5 mr-2" />
          {t('button.create_new_category')}
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-1 border-dashed p-0">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('create_new_category')}
          </h3>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('category_name_ua')} *</label>
            <Input value={formData.label} onChange={e => updateFormData({ label: e.target.value })} placeholder="Білі вина" className="w-full" autoFocus />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t('category_name_en')} *</label>
            <Input value={formData.labelEn} onChange={e => updateFormData({ labelEn: e.target.value })} placeholder="White wines" className="w-full" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">{t('base_color')} *</label>
          <div className="flex items-center gap-4">
            <ColorPicker value={formData.value ? `#${formData.value}` : ''} onChange={color => updateFormData({ value: color.replace('#', '') })} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCancel} variant="outline" className="flex-1" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateCategory} disabled={!canCreateCategory || isLoading} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
