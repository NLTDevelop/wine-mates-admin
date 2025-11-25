import { useTranslation } from 'react-i18next'
import { useCreateTaste } from '../../presenters/useCreateTaste'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { CreateWineTasteRequest } from '../../entities/types/tastes'
import { BaseWineColor } from '../../../general/entities/types'
import { Plus, Grape } from 'lucide-react'
import { TasteForm } from '..'

interface CreateTasteSectionProps {
  onCreateTaste: (tasteData: CreateWineTasteRequest) => void
  isLoading?: boolean
  cachedColors: BaseWineColor[]
}

export const CreateTasteSection = ({ onCreateTaste, isLoading = false, cachedColors }: CreateTasteSectionProps) => {
  const { t } = useTranslation('wines')

  const { isExpanded, formData, updateFormData, handleCreateTaste, handleCancel, expandForm } = useCreateTaste({ onCreateTaste, isLoading })

  if (!isExpanded) {
    return (
      <div>
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
          <h2 className="text-2xl font-bold">{t('tastes.tastes')}</h2>
          <Button onClick={expandForm} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('button.create_new_taste')}
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
            <Grape className="w-5 h-5" />
            {t('tastes.create_new_taste')}
          </h3>
        </CardHeader>
        <TasteForm mode="create" formData={formData} onFormDataChange={updateFormData} onSave={handleCreateTaste} onCancel={handleCancel} isLoading={isLoading} cachedColors={cachedColors} />
      </CardContent>
    </Card>
  )
}
