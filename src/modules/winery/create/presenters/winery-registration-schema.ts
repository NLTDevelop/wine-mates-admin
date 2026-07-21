import i18n from 'i18next'
import { z } from 'zod'

const urlListSchema = () =>
  z
    .string()
    .optional()
    .refine(
      value => {
        if (!value?.trim()) return true

        return value
          .split(/[\n,]+/)
          .map(link => link.trim())
          .filter(Boolean)
          .every(link => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(link))
      },
      {
        message: i18n.t('messages:invalid_links'),
      }
    )

const currentYear = new Date().getFullYear()

export const wineryRegistrationSchema = () =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, i18n.t('messages:field_require'))
      .email(i18n.t('messages:email_invalid')),

    password: z.string().min(6, i18n.t('messages:password_min')),

    phoneNumber: z
      .string()
      .trim()
      .min(1, i18n.t('messages:phoneNumber_require')),

    userCountryId: z.coerce
      .number()
      .min(1, i18n.t('messages:country_require')),

    birthday: z
      .string()
      .trim()
      .min(1, i18n.t('messages:date_require'))
      .refine(
        value => !Number.isNaN(new Date(value).getTime()),
        i18n.t('messages:date_invalid')
      )
      .refine(
        value => new Date(value) <= new Date(),
        i18n.t('messages:future_date')
      ),

    name: z
      .string()
      .trim()
      .min(1, i18n.t('messages:name_require'))
      .max(200, i18n.t('messages:long_name')),

    foundedYear: z.coerce
      .number()
      .int(i18n.t('messages:integer_year'))
      .min(1000, i18n.t('messages:old_year'))
      .max(currentYear, i18n.t('messages:feature_year')),

    description: z
      .string()
      .trim()
      .min(1, i18n.t('messages:field_require'))
      .max(3000, i18n.t('messages:description_max_length')),

    wineryCountryId: z.coerce
      .number()
      .min(1, i18n.t('messages:country_require')),

    regionId: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .transform(value => (value ? Number(value) : null))
      .refine(
        value => value === null || value > 0,
        i18n.t('messages:region_require')
      ),

    links: urlListSchema(),
  })

export type WineryRegistrationFormValues = z.input<ReturnType<typeof wineryRegistrationSchema>>
export type WineryRegistrationFormData = z.output<ReturnType<typeof wineryRegistrationSchema>>