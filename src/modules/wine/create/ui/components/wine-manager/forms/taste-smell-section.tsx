
import { UseFormReturn } from "react-hook-form"
import { Card, CardContent } from "@/UIKit/shadcn/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/UIKit/shadcn/ui/form"
import { SelectColorPicker } from "@/UIKit/shadcn/ui/select-color-picker"

import { Star } from 'lucide-react'
import { CreateWineFormData } from "@/modules/wine/create/entities/types"
import { useWineFlavors } from "@/modules/wine/create/presenters/useWineFlavors"
import { useWineSmells } from "@/modules/wine/create/presenters/useWineSmells"
import { useState } from "react"
import { AccordionWrapper } from "@/UIKit/shadcn/ui/accordion-wrapper"

interface TasteSmellSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const TasteSmellSection = ({ form }: TasteSmellSectionProps) => {
    const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  const { flavors, isLoading: flavorsLoading } = useWineFlavors()
  const { smells, isLoading: smellsLoading } = useWineSmells()

  return (
     <AccordionWrapper
      label="Вкусовые и ароматические профили"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
         <Star className="w-5 h-5" />
          <p> Вкусовые и ароматические профили</p>
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
              <FormLabel>Вкусовой профиль</FormLabel>
              <FormControl>
                <SelectColorPicker 
                  placeholderText="Выберите вкус" 
                  options={flavors} 
                  selectedValue={field.value[0] || ''} 
                  selectedItem={form.watch('flavorVariety')}
                  onValueChange={(value) => field.onChange([value])}
                  onItemChange={(variety) => form.setValue('flavorVariety', variety)}
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
              <FormLabel>Ароматический профиль</FormLabel>
              <FormControl>
                <SelectColorPicker 
                  placeholderText="Выберите аромат" 
                  options={smells} 
                  selectedValue={field.value[0] || ''} 
                  selectedItem={form.watch('smellVariety')}
                  onValueChange={(value) => field.onChange([value])}
                  onItemChange={(variety) => form.setValue('smellVariety', variety)}
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