import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { Input } from '@/UIKit/shadcn/ui/input'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Wine } from 'lucide-react'
import { useState } from 'react'
import { AccordionWrapper } from '@/UIKit/shadcn/ui/accordion-wrapper'
import { useTranslation } from 'react-i18next'
import { NLTFormFilesDropZone } from '@/UIKit/components/NLTFormFilesDropZone'
import { CreateWineFormData } from '@/modules/wine/create/wine-types/entities/types/wine-type'

interface BasicInfoSectionProps {
  form: UseFormReturn<CreateWineFormData>
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  const { t } = useTranslation('wines')
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  return (
    <AccordionWrapper
      label="Основная информация"
      isOpen={isOpenAccordion}
      onToggle={setIsOpenAccordion}
      header={
        <div className="flex items-center gap-2">
          <Wine className="w-5 h-5" />
          <p>{t('main_info')}</p>
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
                  <FormLabel>{t('wine_name') + '*'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('wine_name')} />
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
                  <FormLabel>{t('winery') + '*'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('winery_name')} />
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
                <FormLabel>{t('wine_description') + '*'}</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={t('detailed_description')} className="min-h-[100px] bg-background" />
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
                  <FormLabel>{t('region') + '*'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('region')} />
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
                  <FormLabel>{t('country') + '*'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('country')} />
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
                  <FormLabel>{t('vintage') + '*'} </FormLabel>
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
                  <FormLabel>{t('grade')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('grade')} />
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
                  <FormLabel>{t('additional_title')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('additional_title')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* TODO добавить disabled */}
          <Card className="mt-2 p-4 bg-background">
            <div className="grid grid-cols-1 mt-2">
              <NLTFormFilesDropZone form={form} name="media" />
            </div>
          </Card>
        </CardContent>
      </Card>
    </AccordionWrapper>
  )
}
