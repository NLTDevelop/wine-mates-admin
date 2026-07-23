import i18n from 'i18next'
import { z } from 'zod'

const currentYear = new Date().getFullYear()

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


export const wineryEditSchema = () => z.object({
  name: z.string().trim().min(1, i18n.t('messages:name_require')).max(200, i18n.t('messages:long_name')),
  foundedYear: z.coerce.number().int(i18n.t('messages:integer_year')).min(1000, i18n.t('messages:old_year_create')).max(currentYear, i18n.t('messages:feature_year')),
  description: z.string().trim().min(1, i18n.t('messages:field_require')).max(3000),
  countryId: z.coerce.number().min(1, i18n.t('messages:country_require')),
  regionId: z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform(value => (value ? Number(value) : null))
    .refine(value => value === null || value > 0, i18n.t('messages:region_require')),
  links: urlListSchema(),
})

export type WineryEditFormValues = z.infer<ReturnType<typeof wineryEditSchema>>
export type WineryEditFormData = z.infer<ReturnType<typeof wineryEditSchema>>