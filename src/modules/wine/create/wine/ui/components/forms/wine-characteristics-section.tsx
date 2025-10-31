import { CreateWineFormData } from '@/modules/wine/create/general/entities/types'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Slider } from '@/UIKit/shadcn/ui/slider'
import { ToolCase } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface WineCharacteristicsSectionProps {
  form: UseFormReturn<CreateWineFormData>
}
export const WineCharacteristicsSection = ({ form }: WineCharacteristicsSectionProps) => {
  const { t } = useTranslation('wines')
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  return (
    <AccordionWrapper
      label={t('visual_characteristics')}
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <ToolCase className="w-5 h-5" />
          <p>{t('wine_characteristics')}</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-6">
          {[
            { name: 'sweetness', label: t('sweetness'), description: t('from_dry_to_sweet') },
            { name: 'acidity', label: t('acidity'), description: t('acidity_level') },
            { name: 'tanninLevel', label: t('tanninLevel'), description: t('qty_tannins') },
            { name: 'tanninIntensity', label: t('tanninIntensity'), description: t('power_tannins') },
            { name: 'alcohol', label: t('alcohol'), description: t('alcohol_level') },
            { name: 'body', label: t('body'), description: t('saturation_density') },
            { name: 'finish', label: t('finish'), description: t('finish_duration') },
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
