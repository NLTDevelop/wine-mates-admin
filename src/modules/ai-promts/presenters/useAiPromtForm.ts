import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FeatureType } from '../entities/types'
import { FIXED_THRESHOLDS } from '../entities/constants'

const openAISchema = z.object({
  model: z.string().min(1, { message: "Модель обов'язкове поле" }),
  systemPrompt: z.string().min(1, { message: "Промт обов'язкове поле" }),
  temperature: z.number().min(0, { message: 'Температура має бути від 0 до 2' }).max(2, { message: 'Температура має бути від 0 до 2' }).optional(),
  maxTokens: z.number().int({ message: 'Поле має бути цілим числом' }).min(1, { message: 'Поле має бути більше 0' }).optional(),
})

const thresholdSchema = z.object({
  name: z.string().min(1, { message: "Назва порогу обов'язкова" }),
  value: z.number().min(0, { message: 'Значення має бути від 0 до 1' }).max(2, { message: 'Значення має бути від 0 до 1' }),
  description: z.string().min(1, { message: "Опис обов'язковий" }),
})

const geminiSchema = z.object({
  model: z.string().min(1, { message: "Модель обов'язкове поле" }),
  systemPrompt: z.string().min(1, { message: "Промт обов'язкове поле" }),
  thresholds: z.array(thresholdSchema).min(1),
})

export type OpenAIConfig = z.infer<typeof openAISchema>
export type GeminiConfig = z.infer<typeof geminiSchema>

export const useAiPromtForm = (activeTab: FeatureType) => {
  const isScanner = activeTab === 'scanner'

  const form = useForm<OpenAIConfig | GeminiConfig>({
    resolver: zodResolver(isScanner ? geminiSchema : openAISchema),
    defaultValues: isScanner
      ? {
          model: 'gemini-2.5-flash',
          systemPrompt: '',
          thresholds: FIXED_THRESHOLDS.map(t => ({
            name: t.name,
            value: t.name === 'FTS_CONFIDENT_RATIO' ? 1.2 : t.name.includes('CONFIDENT') ? 0.8 : 0.65,
            description: t.description,
          })),
        }
      : {
          model: 'gpt-4o',
          systemPrompt: '',
          temperature: 0.7,
          maxTokens: 300,
        },
  })

  return {
    form,
    isScanner,
  }
}
