import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { CreateWineFormData } from '../../../entities/types'
import { BasicInfoSection } from './forms/basic-info-section'
import { VisualCharacteristicsSection } from './forms/visual-characteristics-section'
import { TasteSmellSection } from './forms/taste-smell-section'
import { WineCharacteristicsSection } from './forms/wine-characteristics-section'
import { AgingSection } from './forms/aging-section'

export const CreateWineForm: React.FC = () => {
  const { t } = useTranslation('common')

  const form = useForm<CreateWineFormData>({
    defaultValues: {
      basicInfo: {
        name: '',
        fullDescription: '',
        region: '',
        country: '',
        vintage: new Date().getFullYear(),
        imageUrl: '',
        subtitle: '',
      },
      color: '',
      colorVariety: '',
      tasteTags: { descriptors: [] },
      smellTags: { descriptors: [] },
      flavorVariety: '',
      smellVariety: '',
      characteristics: {
        sweetness: 5,
        acidity: 5,
        tanninLevel: 5,
        tanninIntensity: 5,
        alcohol: 5,
        body: 5,
        finish: 5,
      },
      aging: {
        peakStart: new Date().getFullYear(),
        peakEnd: new Date().getFullYear() + 5,
      },
      foodPairing: { categories: [] },
      winery: '',
      grade: '',
      customName: '',
    },
  })

  const onSubmit = (data: CreateWineFormData) => {
    console.log('Wine data:', data)
    // API запрос на создание вина
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <BasicInfoSection form={form} />
        <VisualCharacteristicsSection form={form} />
        <TasteSmellSection form={form} />
        <WineCharacteristicsSection form={form} />
        <AgingSection form={form} />

        <div className="flex gap-4 justify-end pt-4">
          <Button type="button" variant="outline">
            {t('button.cancel')}
          </Button>
          <Button type="submit" className="min-w-32">
            {t('button.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
