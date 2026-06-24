import { useTranslation } from 'react-i18next'
import { useCreateTasteCharacteristic } from '../../presenters/useCreateTasteCharacteristic'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { CreateWineTasteCharacteristicRequest } from '../../entities/taste-characteristics'
import { CharacteristicFormFields } from '..'
import { Plus, Flower } from 'lucide-react'

interface CreateTasteCharacteristicSectionProps {
  onCreateCharacteristic: (characteristicData: CreateWineTasteCharacteristicRequest) => void
  isLoading?: boolean
}

export const CreateTasteCharacteristicSection = ({ onCreateCharacteristic, isLoading = false }: CreateTasteCharacteristicSectionProps) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  const { isExpanded, formData, canCreate, updateFormData, handleCreateTasteCharacteristic, handleCancel, expandForm } = useCreateTasteCharacteristic({
    onCreateTasteCharacteristic: onCreateCharacteristic,
    isLoading,
  })

  if (!isExpanded) {
    return (
      <div>
        <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
          <h2 className="text-2xl font-bold">{t('taste_characteristics.characteristics')}</h2>
          <Button onClick={expandForm} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            {t('button.add_new_characteristic')}
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
            {t('taste_characteristics.create_new_characteristic')}
          </h3>
        </CardHeader>

        <CharacteristicFormFields formData={formData} onFormDataChange={updateFormData} />

        <div className="flex justify-end gap-2 flex-col sm:flex-row mt-4">
          <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
            {tc('button.cancel')}
          </Button>
          <Button onClick={handleCreateTasteCharacteristic} disabled={!canCreate || isLoading}>
            <Plus className="w-4 h-4" />
            {isLoading ? tc('button.saving') : tc('button.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
