import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { SelectColorPicker } from '@/UIKit/shadcn/ui/select-color-picker'
import { Image } from 'lucide-react'
import { useWineColors } from '@/modules/wine/create/presenters/useWineColors'
import { CreateWineFormData } from '@/modules/wine/create/entities/types'
import { useState } from 'react'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'

interface VisualCharacteristicsSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const VisualCharacteristicsSection = ({ form }: VisualCharacteristicsSectionProps) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  const { colors, isLoading } = useWineColors()

  return (
    <AccordionWrapper
      label="Визуальные характеристики"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          <p>Визуальные характеристики</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цвет вина *</FormLabel>
                <FormControl>
                  <SelectColorPicker
                    placeholderText="Выберите цвет"
                    options={colors} 
                    selectedValue={field.value}
                    selectedItem={form.watch('colorVariety')}
                    onValueChange={field.onChange}
                    onItemChange={variety => form.setValue('colorVariety', variety)}
                  />
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
