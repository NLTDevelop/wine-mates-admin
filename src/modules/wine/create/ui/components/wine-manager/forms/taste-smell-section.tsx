import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { SelectColorPicker } from '@/UIKit/shadcn/ui/select-color-picker'
import { Star } from 'lucide-react'
import { CreateWineFormData } from '@/modules/wine/create/entities/types'
import { useWineFlavors } from '@/modules/wine/create/presenters/useWineFlavors'
import { useWineSmells } from '@/modules/wine/create/presenters/useWineSmells'
import { useState } from 'react'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useTranslation } from 'react-i18next'

interface TasteSmellSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const TasteSmellSection = ({ form }: TasteSmellSectionProps) => {
  const { t } = useTranslation('wines')
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  const { flavors } = useWineFlavors()
  const { smells } = useWineSmells()

  return (
    <AccordionWrapper
      label={t('teste_characteristics')}
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          <p> {t('teste_smell_characteristics')}</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="tasteTags.descriptors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('flavor')}</FormLabel>
                <FormControl>
                  <SelectColorPicker
                    placeholderText={t('chose_flavor')}
                    options={flavors}
                    selectedValue={field.value[0] || ''}
                    selectedItem={form.watch('flavorVariety')}
                    onValueChange={value => field.onChange([value])}
                    onItemChange={variety => form.setValue('flavorVariety', variety)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smellTags.descriptors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('smell')}</FormLabel>
                <FormControl>
                  <SelectColorPicker
                    placeholderText={t('chose_aroma')}
                    options={smells}
                    selectedValue={field.value[0] || ''}
                    selectedItem={form.watch('smellVariety')}
                    onValueChange={value => field.onChange([value])}
                    onItemChange={variety => form.setValue('smellVariety', variety)}
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
