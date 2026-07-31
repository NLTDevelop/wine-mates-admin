import i18n from 'i18next'
import { z } from 'zod'
import { PARTNER_STATUS } from '../entities/types'

export const partnerFormSchema = (isEdit = false) =>
  z.object({
    name: z.string().trim().min(1, i18n.t('messages:name_require')).max(200, i18n.t('messages:long_name')),
    website: z
      .string()
      .optional()
      .transform(value => value?.trim() || '')
      .refine(value => !value || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value), i18n.t('messages:invalid_url')),
    countryIds: z.array(z.number()).min(1, i18n.t('messages:field_require')),
    status: isEdit ? z.enum([PARTNER_STATUS.ACTIVE, PARTNER_STATUS.INACTIVE]) : z.enum([PARTNER_STATUS.ACTIVE, PARTNER_STATUS.INACTIVE]).optional(),
    logo: z.any().nullable().optional(),
    image: z.any().nullable().optional(),
  })

export type PartnerFormValues = z.infer<ReturnType<typeof partnerFormSchema>>
export type PartnerFormData = z.infer<ReturnType<typeof partnerFormSchema>>
