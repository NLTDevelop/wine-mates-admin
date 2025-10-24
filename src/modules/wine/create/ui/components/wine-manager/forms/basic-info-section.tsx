import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent} from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Wine } from 'lucide-react'
import { CreateWineFormData } from '@/modules/wine/create/entities/types'
import { useState } from 'react'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'

interface BasicInfoSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  return (
    <AccordionWrapper
      label="Основная информация"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Wine className="w-5 h-5" />
          <p>Основная информация</p>
        </div>
      }
    >
      <Card className="rounded-t-none bg-input/50">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="basicInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название вина *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Например: Château Margaux" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="winery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Винодельня *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Название винодельни" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="basicInfo.fullDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание вина *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Подробное описание вкуса, аромата и характеристик вина..." className="min-h-[100px] bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="basicInfo.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Регион *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Бордо, Тоскана и т.д." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basicInfo.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Страна *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Франция, Италия и т.д." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basicInfo.vintage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Год урожая *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} min={1900} max={new Date().getFullYear()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Класс/Категория</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Grand Cru, Reserva и т.д." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Кастомное название</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Дополнительное название" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="basicInfo.imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL изображения</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/wine-image.jpg" />
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
