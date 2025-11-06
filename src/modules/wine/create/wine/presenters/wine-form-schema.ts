import { z } from 'zod'

const fileSchema = z.instanceof(File, { message: 'Must be a file' })

const optionalNumberSchema = z.preprocess(
  val => {
    if (val === undefined || val === null || val === '') return undefined
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      if (val === '') return undefined
      const num = parseInt(val)
      return isNaN(num) ? undefined : num
    }
    return undefined
  },
  z
    .number()
    .int('Рік має бути цілим числом')
    .min(1900, 'Рік має бути не раніше 1900')
    .max(new Date().getFullYear() + 50, 'Рік не може бути більше ніж на 50 років вперед')
    .optional()
)

const requiredNumberSchema = z.preprocess(
  val => {
    if (typeof val === 'string') {
      if (val === '') return undefined
      return parseInt(val)
    }
    return val
  },
  z
    .number({
      message: "Поле обов'язкове",
    })
    .refine(val => !isNaN(val), {
      message: 'Введіть коректний рік',
    })
    .refine(val => val >= 1900, {
      message: 'Рік має бути не раніше 1900',
    })
    .refine(val => val <= new Date().getFullYear(), {
      message: 'Рік не може бути у майбутньому',
    })
)

export const wineFormSchema = z
  .object({
    displayName: z.string().min(1, "Назва обов'язкова").max(200, 'Назва задовга'),
    producerTitle: z.string().min(1, "Назва виробника обов'язкова").max(200),
    producerName: z.string().min(1, "Ім'я виробника обов'язкове").max(200),
    wine: z.string().min(1, "Назва вина обов'язкова").max(200),
    grapeVariety: z.string().min(1, "Сорт винограду обов'язкове поле").max(200),

    country: z.string().min(1, "Країна обов'язкова"),
    region: z.string().optional(),
    subRegion: z.string().optional(),

    site: z.string().max(300).optional(),
    subType: z.string().max(100).optional(),
    designation: z.string().max(100).optional(),
    classification: z.string().max(100).optional(),
    reference: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),

    type: z.string().min(1, "Тип вина обов'язковий"),

    vintageConfig: requiredNumberSchema
      .refine(val => val !== undefined && val >= 1900, 'Рік винтажу має бути не раніше 1900')
      .refine(val => val !== undefined && val <= new Date().getFullYear(), 'Рік винтажу не може бути у майбутньому'),

    firstVintage: optionalNumberSchema
      .refine(val => val === undefined || val >= 1900, 'Рік початку має бути не раніше 1900')
      .refine(val => val === undefined || val <= new Date().getFullYear(), 'Рік початку не може бути у майбутньому'),

    finalVintage: optionalNumberSchema
      .refine(val => val === undefined || val >= 1900, 'Рік завершення має бути не раніше 1900')
      .refine(val => val === undefined || val <= new Date().getFullYear() + 50, 'Рік завершення не може бути більше ніж на 50 років вперед'),

    media: z.array(fileSchema).min(1, "Принаймні одне зображення обов'язкове").max(10, 'Максимум 10 зображень'),
  })
  .refine(
    data => {
      if (data.firstVintage && data.finalVintage) {
        return data.finalVintage >= data.firstVintage
      }
      return true
    },
    {
      message: 'Кінцевий винтаж має бути після початкового',
      path: ['finalVintage'],
    }
  )
  .refine(
    data => {
      if (data.country && data.country.trim() !== '' && (!data.region || data.region.trim() === '')) {
        return false
      }
      return true
    },
    {
      message: "Регіон обов'язковий при виборі країни",
      path: ['region'],
    }
  )

export type WineFormData = Omit<z.infer<typeof wineFormSchema>, 'vintageConfig'> & {
  vintageConfig: number
}
