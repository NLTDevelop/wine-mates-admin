import React, { useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVintageOptions } from '../../../presenters/useVintageOptions'
import { Form } from '@/UIKit/shadcn/ui/form'

export const createVintageFormSchema = () => {
  return z.object({
    vintage: z.union([z.string(), z.number()]),
  })
}

export const VintageInfoSection: React.FC<{ wine: IWines; onVintageChange?: (wineId: string) => void }> = ({ wine, onVintageChange }) => {
  const { t } = useTranslation('wines')
  const { t: tc } = useTranslation('common')

  //mock

  const vintages = [
    { wineId: 92, vintage: 2055 },
    { wineId: 137, vintage: 2045 },
    { wineId: 138, vintage: 2022 },
    { wineId: 93, vintage: 214 },
  ]

  // const vintages = wine?.vintages || []

  const schema = createVintageFormSchema()
  type VintageFormSchemaType = z.infer<typeof schema>

  const form = useForm<VintageFormSchemaType>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      vintage: wine.vintage,
    },
    mode: 'onChange',
  })

  const vintageValue = form.watch('vintage')
  const isDirty = form.formState.isDirty

  const { fetchOptions } = useVintageOptions({ vintages })

  useEffect(() => {
    if (isDirty && vintageValue !== undefined) {
      form.trigger().then(isValid => {
        if (isValid) {
          const formData = form.getValues()

          const wineId = formData.vintage === '' || formData.vintage === undefined || formData.vintage === wine.vintage ? wine.id!.toString() : String(formData.vintage)

          if (onVintageChange) {
            onVintageChange(wineId)
          }
        }
      })
    }
  }, [vintageValue])

  return (
    <section className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calendar size={20} />
        {t('vintage_info')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-end gap-6 border-b border-input">
          <span className="text-sm font-medium text-gray-500 flex-1 pb-2">{t('table.vintageconfig')}</span>

          <Form {...form}>
            <form className="space-y-6 flex-1">
              <FormFieldCombobox form={form} formLabel={''} name="vintage" placeholder={wine.vintage?.toString()} searchLabel={tc('search')} fetchOptions={fetchOptions} />
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
