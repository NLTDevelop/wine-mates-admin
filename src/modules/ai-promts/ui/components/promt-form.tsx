import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePromtStore } from '../../entities/promt-store'
import { GeminiConfig, OpenAIConfig } from '../../presenters/useAiPromtForm'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/UIKit/shadcn/ui/form'
import { FileTextIcon } from 'lucide-react'
import { Textarea } from '@/UIKit/shadcn/ui/textarea'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { Separator } from '@/UIKit/shadcn/ui/separator'
import { FormFieldCombobox } from '@/UIKit/app-components/form-field-combobox'
import { IOption } from '@/UIKit/components/NLTFormCombobox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/UIKit/shadcn/ui/accordion'
import { InputWithTooltip } from '@/UIKit/app-components/input-with-tooltip'
import { ThresholdsList } from '..'

interface PromtFormProps {
  form: UseFormReturn<OpenAIConfig | GeminiConfig>
  isScanner: boolean
  onSubmit: (data: any) => void
  isPending?: boolean
  fetchOptions: (search?: string | undefined) => Promise<IOption[]>
  modelOptions: IOption[]
  handleReset: () => Promise<void>
}

export function PromtForm({ form, isScanner, onSubmit, isPending, fetchOptions, modelOptions, handleReset }: PromtFormProps) {
  const { t } = useTranslation('promt')
  const { t: c } = useTranslation('common')
  const { activeTab, accordionState, setAccordionState } = usePromtStore()

  const currentAccordionValue = accordionState[activeTab]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex-row justify-between flex-wrap">
            <div>
              <CardTitle className="text-foreground font-bold mb-2">{t('settings', { slug: t('ai_model') })}</CardTitle>
              <CardDescription>{isScanner ? t('settings', { slug: t('gemini_model') }) : t('settings', { slug: t('openai_model') })}</CardDescription>
            </div>
            <Button type="button" variant="secondary" onClick={handleReset} disabled={isPending}>
              {t('reset_prompt')}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormFieldCombobox
                form={form}
                formLabel={t('model')}
                name="model"
                disabled={isPending}
                placeholder={t('chose_model')}
                searchLabel={t('search')}
                fetchOptions={fetchOptions}
                options={modelOptions}
                showX={false}
              />

              {!isScanner && (
                <>
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => {
                      const isOpenAIField = !isScanner
                      const error = isOpenAIField ? (form.formState.errors as Partial<Record<keyof OpenAIConfig, any>>).temperature?.message : undefined
                      return (
                        <FormItem>
                          <FormLabel>{t('temperature')}</FormLabel>
                          <FormControl>
                            <InputWithTooltip
                              type="number"
                              step="0.1"
                              placeholder={t('entry_value')}
                              min="0"
                              {...field}
                              onChange={e => {
                                const value = e.target.value
                                if (value === '') {
                                  field.onChange(undefined)
                                } else {
                                  field.onChange(parseFloat(value))
                                }
                              }}
                              value={field.value ?? ''}
                              disabled={isPending}
                              error={error}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="maxTokens"
                    render={({ field }) => {
                      const isOpenAIField = !isScanner
                      const error = isOpenAIField ? (form.formState.errors as Partial<Record<keyof OpenAIConfig, any>>).maxTokens?.message : undefined
                      return (
                        <FormItem>
                          <FormLabel>{t('max_tokens')}</FormLabel>
                          <FormControl>
                            <InputWithTooltip
                              type="number"
                              step="1"
                              min="1"
                              placeholder={t('entry_integer_value')}
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              value={typeof field.value === 'number' ? field.value : ''}
                              disabled={isPending}
                              error={error}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                </>
              )}
            </div>

            <Accordion type="single" collapsible value={currentAccordionValue} onValueChange={value => setAccordionState(activeTab, value)} className="w-full">
              <AccordionItem value="prompt" className="bg-accent-foreground/5 rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline  cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col items-start">
                      <span className="text-base font-medium">{t('system_prompt')}</span>
                      <span className="text-xs text-muted-foreground">{form.watch('systemPrompt')?.length ? `${form.watch('systemPrompt').length} символів` : 'Натисніть, щоб редагувати'}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{t('system_prompt')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('enter_system_prompt')} className="h-svh font-mono text-sm" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {isScanner && (
              <>
                <Separator className="my-4" />
                <ThresholdsList form={form as UseFormReturn<GeminiConfig>} disabled={isPending} />
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending || !form.formState.isDirty} className="mt-4">
              {isPending ? c('button.saving') : c('button.save')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
