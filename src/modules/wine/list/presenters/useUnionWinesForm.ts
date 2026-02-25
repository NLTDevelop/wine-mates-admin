import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const currentYear = new Date().getFullYear()

const wineSchema = z.object({
  typeId: z.any().refine(val => val !== null && val !== undefined, {
    message: "Тип вина обов'язковий",
  }),
  colorId: z.any().refine(val => val !== null && val !== undefined, {
    message: "Колір вина обов'язковий",
  }),
  countryId: z.any().refine(val => val !== null && val !== undefined, {
    message: "Країна обов'язкова",
  }),
  producer: z.string().min(1, { message: "Виробник обов'язковий" }),
  grapeVariety: z.string().min(1, { message: "Сорт винограду обов'язковий" }),

  name: z.string().optional(),
  vintage: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .nullable()
    .transform(val => {
      if (!val) return null
      const num = Number(val)
      return isNaN(num) ? null : num
    })
    .refine(
      val => {
        if (val === null) return true
        return val >= 1900 && val <= currentYear
      },
      { message: `Рік має бути від 1900 до ${currentYear}` }
    )
    .optional(),
  regionId: z.any().nullable().optional(),
  image: z.any().nullable().optional(),
})

export const useUnionWinesForm = () => {
  return useForm({
    resolver: zodResolver(wineSchema),
    defaultValues: {
      name: '',
      vintage: null,
      producer: '',
      grapeVariety: '',
      countryId: null,
      regionId: null,
      typeId: null,
      colorId: null,
      image: null,
    },
  })
}
