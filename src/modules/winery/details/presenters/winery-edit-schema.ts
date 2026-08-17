import i18n from 'i18next'
import { z } from 'zod'

const currentYear = new Date().getFullYear()
export const MAX_WINERY_GALLERY_PHOTOS = 4

const urlListSchema = () =>
  z
    .string()
    .optional()
    .refine(value => {
      if (!value?.trim()) return true

      return value
        .split(/[\n,]+/)
        .map(link => link.trim())
        .filter(Boolean)
        .every(link => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(link))
    }, i18n.t('messages:invalid_links'))

export const wineryEditSchema = () =>
  z.object({
    name: z.string().trim().min(1, i18n.t('messages:name_require')).max(200, i18n.t('messages:long_name')),
    foundedYear: z
      .any()
      .transform(val => {
        if (val === '' || val === null || val === undefined) return null
        const num = Number(val)
        return isNaN(num) ? null : num
      })
      .pipe(
        z
          .number()
          .int(i18n.t('messages:integer_year'))
          .min(1000, i18n.t('messages:old_year'))
          .max(currentYear, i18n.t('messages:feature_year'))
          .nullable()
          .refine(val => val !== null, i18n.t('messages:field_require'))
      ),
    description: z.string().trim().min(1, i18n.t('messages:field_require')).max(3000),
    countryId: z
      .union([z.string(), z.number()])
      .nullable()
      .transform(v => (v ? String(v) : null)),

    regionId: z
      .union([z.string(), z.number()])
      .nullable()
      .transform(v => (v ? String(v) : null)),
    sellerCountryIds: z.array(z.number()).min(1, i18n.t('messages:field_require')),
    links: urlListSchema(),
    mainPhoto: z.any().nullable().optional(),
    gallery: z.array(z.any()).max(MAX_WINERY_GALLERY_PHOTOS, i18n.t('messages:max_winery_gallery_photos')).optional(),
    removeGalleryFileIds: z.array(z.number()).optional(),
  })

export type WineryEditFormValues = z.infer<ReturnType<typeof wineryEditSchema>>
export type WineryEditFormData = z.infer<ReturnType<typeof wineryEditSchema>>
