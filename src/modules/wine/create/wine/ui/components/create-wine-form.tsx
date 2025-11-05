
import { useTranslation } from 'react-i18next'
import { Form } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { BasicInfoSection } from './forms/basic-info-section'

import { WineType } from '../../../wine-types/entities/types/wine-type'
import { useWineForm } from '../../presenters/useWineForm'
import { WineFormData } from '../../presenters/wine-form-schema'

interface CreateWineFormProps {
  wineTypes: WineType[] 
}

export const CreateWineForm: React.FC<CreateWineFormProps> = ({ wineTypes }) => {
  const { t } = useTranslation('common')

  const form = useWineForm()

  const onSubmit = (data: WineFormData) => {
    console.log('Wine data:', data)
    // TODO: API запрос на создание вина
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form as any} wineTypes={wineTypes} />
        
        {/* TODO: Добавить остальные секции когда будут готовы */}
        {/* <ClassificationSection form={form} /> */}
        {/* <VintageSection form={form} /> */}
        {/* <MediaSection form={form} /> */}

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