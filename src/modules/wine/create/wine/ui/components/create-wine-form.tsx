import { useTranslation } from 'react-i18next'
import { useWineForm } from '../../presenters/useWineForm'
import { Form } from '@/UIKit/shadcn/ui/form'
import { Button } from '@/UIKit/shadcn/ui/button'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineFormData } from '../../presenters/wine-form-schema'
import { BasicInfoSection } from '..'

interface CreateWineFormProps {
  wineTypes: WineType[]
}

export const CreateWineForm: React.FC<CreateWineFormProps> = ({ wineTypes }) => {
  const { t } = useTranslation('common')

  const form = useWineForm()

  const onSubmit = (data: WineFormData) => {
    console.log('Wine data:', data)
    // TODO: API запрос на создание вина
    onReset()
  }

  const onReset = () => form.reset()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection form={form as any} wineTypes={wineTypes} />
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onReset}>
            {t('button.clear')}
          </Button>
          <Button type="submit" className="min-w-32" /*disabled={!form.formState.isValid}*/>
            {t('button.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
