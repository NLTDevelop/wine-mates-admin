import i18n from 'i18next'
import { z } from 'zod'

const existingImageSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  alt: z.string().optional(),
  order: z.number().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
})

export const createWineFormSchema = () =>
  z.object({
    id: z
      .union([z.string(), z.number()])
      .optional()
      .transform(v => v?.toString()),

    name: z.string().trim().min(1, i18n.t('messages:name_require')).max(200),

    vintage: z
      .union([z.string(), z.number()])
      .nullable()
      .optional()
      .transform(v => (v ? Number(v) : null)),

    countryId: z
      .union([z.string(), z.number()])
      .nullable()
      .transform(v => (v ? Number(v) : null)),

    regionId: z
      .union([z.string(), z.number()])
      .nullable()
      .transform(v => (v ? Number(v) : null)),

    typeId: z
      .union([z.string(), z.number(), z.null()])
      .transform(v => (v ? Number(v) : null))
      .refine(v => v !== null && v > 0, { message: i18n.t('messages:wine_type_require') }),

    colorId: z
      .union([z.string(), z.number(), z.null()])
      .transform(v => (v ? Number(v) : null))
      .refine(v => v !== null && v > 0, { message: i18n.t('messages:wine_color_require') }),

    producer: z.string().optional(),
    grapeVariety: z.string().optional(),

    image: z.union([z.instanceof(File), existingImageSchema, z.null()]).optional(),
  })

export type WineFormData = z.infer<ReturnType<typeof createWineFormSchema>>
