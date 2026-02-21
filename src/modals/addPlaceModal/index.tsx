import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NLTModal } from '@/UIKit/components/NLTModal'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Input } from '@/UIKit/shadcn/ui/input'
import { TableFormTime } from '@/UIKit/components/NLTFormTime'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'

export const addPlaceSchema = z.object({
  name: z.string().min(1, 'Обовʼязкове поле'),
  address: z.string().min(1, 'Обовʼязкове поле'),
  timeWork: z.string().min(1, 'Обовʼязкове поле'),
})

export interface AddPlaceFormValues {
  name: string
  address: string
  timeWork: string
}

interface AddPlaceModalProps {
  isOpen: boolean
  form: any
  onClose: () => void
}

export const AddPlaceModal: FC<AddPlaceModalProps> = ({ isOpen, onClose, form }) => {
  const { t } = useTranslation('places')

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const handleFormSubmit: SubmitHandler<AddPlaceFormValues> = async data => {
    // Тригеримо валідацію всіх полів
    const isValid = await form.trigger()
    if (!isValid) return

    console.log('Форма валідна, можна надсилати:', data)
    handleClose()
  }

  const { errors } = form.formState

  console.log(errors)
  return (
    <NLTModal isOpen={isOpen} onClose={handleClose} title={t('add_place')}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className={cn('text-sm font-medium mb-2 block', errors.name ? 'text-[#E7000B]' : '')}>{t('table.place_name')} *</label>
            <Input {...form.register('name')} placeholder={t('table.place_name')} />
          </div>

          <label className={cn('text-sm font-medium mb-2 block')} style={errors.timeWork ? { color: '#E7000B' } : undefined}>
            {t('table.time_work')} *
          </label>

          <TableFormTime form={form} name="timeWork" isOnDrawer />

          <div>
            <label className={cn('text-sm font-medium mb-2 block')} style={errors.address ? { color: '#E7000B' } : undefined}>
              {t('table.address')} *
            </label>

            <Input {...form.register('address')} placeholder={t('table.address')} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('button.cancel')}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('button.saving') : t('button.save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </NLTModal>
  )
}
