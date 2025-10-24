import { CreateWineFormData } from '@/modules/wine/create/entities/types'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Slider } from '@/UIKit/shadcn/ui/slider'
import { ToolCase } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface WineCharacteristicsSectionProps {
  form: UseFormReturn<CreateWineFormData>
}
export const WineCharacteristicsSection = ({ form }: WineCharacteristicsSectionProps) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  return (
    <AccordionWrapper
      label="Визуальные характеристики"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <ToolCase className="w-5 h-5" />
          <p>Характеристики вина</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-6">
          {[
            { name: 'sweetness', label: 'Сладость', description: 'От сухого к сладкому' },
            { name: 'acidity', label: 'Кислотность', description: 'Уровень кислотности' },
            { name: 'tanninLevel', label: 'Уровень танинов', description: 'Количество танинов' },
            { name: 'tanninIntensity', label: 'Интенсивность танинов', description: 'Сила танинов' },
            { name: 'alcohol', label: 'Алкоголь', description: 'Уровень алкоголя' },
            { name: 'body', label: 'Тело', description: 'Насыщенность и плотность' },
            { name: 'finish', label: 'Послевкусие', description: 'Длительность финиша' },
          ].map(char => (
            <FormField
              key={char.name}
              control={form.control}
              name={`characteristics.${char.name}` as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{char.label}</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider value={[field.value]} onValueChange={value => field.onChange(value[0])} max={10} step={1} className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span className="font-medium">{field.value}/10</span>
                        <span>10</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>{char.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </CardContent>
      </Card>
    </AccordionWrapper>
  )
}
