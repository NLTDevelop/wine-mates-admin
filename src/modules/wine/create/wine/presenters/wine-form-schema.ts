import i18n from 'i18next'
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
    .int(i18n.t('messages:integer_year'))
    .min(1900, i18n.t('messages:old_year'))
    .max(new Date().getFullYear() + 50, i18n.t('messages:big_year'))
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
      message: i18n.t('messages:field_require'),
    })
    .refine(val => !isNaN(val), {
      message: i18n.t('messages:incorrect_year'),
    })
    .refine(val => val >= 1900, {
      message: i18n.t('messages:old_year'),
    })
    .refine(val => val <= new Date().getFullYear(), {
      message: i18n.t('messages:feature_year'),
    })
)

export const wineFormSchema = z
  .object({
    displayName: z.string().min(1, i18n.t('messages:name_require')).max(200, i18n.t('messages:long_name')),
    producerTitle: z.string().min(1, i18n.t('messages:producer_require')).max(200),
    producerName: z.string().min(1, i18n.t('messages:producer_name_require')).max(200),
    wine: z.string().min(1, i18n.t('messages:wine_name_require')).max(200),
    grapeVariety: z.string().min(1, i18n.t('messages:grape_require')).max(200),

    country: z.string().min(1, i18n.t('messages:country_require')),
    region: z.string().optional(),
    subRegion: z.string().optional(),

    site: z.string().max(300).optional(),
    subType: z.string().max(100).optional(),
    designation: z.string().max(100).optional(),
    classification: z.string().max(100).optional(),
    reference: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),

    type: z.string().min(1, i18n.t('messages:wine_type_require')),

    vintageConfig: requiredNumberSchema
      .refine(val => val !== undefined && val >= 1900, i18n.t('messages:old_vintage'))
      .refine(val => val !== undefined && val <= new Date().getFullYear(), i18n.t('messages:feature_vintage')),

    firstVintage: optionalNumberSchema
      .refine(val => val === undefined || val >= 1900, i18n.t('messages:old_start_year'))
      .refine(val => val === undefined || val <= new Date().getFullYear(), i18n.t('messages:feature_start_year')),

    finalVintage: optionalNumberSchema
      .refine(val => val === undefined || val >= 1900, i18n.t('messages:old_end_year'))
      .refine(val => val === undefined || val <= new Date().getFullYear() + 50, i18n.t('messages:feature_end_year')),

    media: z.array(fileSchema).min(1, i18n.t('messages:img_require')).max(10, i18n.t('messages:max_imgs')),
  })
  .refine(
    data => {
      if (data.firstVintage && data.finalVintage) {
        return data.finalVintage >= data.firstVintage
      }
      return true
    },
    {
      message: i18n.t('messages:end_vintage'),
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
      message: i18n.t('messages:region_require'),
      path: ['region'],
    }
  )

export type WineFormData = Omit<z.infer<typeof wineFormSchema>, 'vintageConfig'> & {
  vintageConfig: number
}
