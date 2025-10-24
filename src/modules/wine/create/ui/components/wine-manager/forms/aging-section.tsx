import { CreateWineFormData } from '@/modules/wine/create/entities/types'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface AgingSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const AgingSection = ({ form }: AgingSectionProps) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  return (
    <AccordionWrapper
      label="Сроки выдержки"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <p>Сроки выдержки</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="aging.peakStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Начало пика</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} min={form.getValues('basicInfo.vintage')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aging.peakEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Конец пика</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} min={form.getValues('aging.peakStart')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </AccordionWrapper>
  )
}
