import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Image } from 'lucide-react'
import { CreateWineFormData } from '@/modules/wine/create/general/entities/types'
import { useState } from 'react'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useTranslation } from 'react-i18next'

interface VisualCharacteristicsSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const VisualCharacteristicsSection = ({ form }: VisualCharacteristicsSectionProps) => {
  const { t } = useTranslation('wines')
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  // const { categories } = useWineColors()

  return (
    <AccordionWrapper
      label={t('visual_characteristics')}
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          <p>{t('visual_characteristics')}</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="color"
            render={(
              {
                /*field*/
              }
            ) => (
              <FormItem>
                <FormLabel>{t('color') + '*'}</FormLabel>
                <FormControl>
                  {/* <SelectColorPicker
                    placeholderText={t('chose_color')}
                    options={categories}
                    selectedValue={field.value}
                    selectedItem={form.watch('colorVariety')}
                    onValueChange={field.onChange}
                    onItemChange={variety => form.setValue('colorVariety', variety)}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </AccordionWrapper>
  )
}
