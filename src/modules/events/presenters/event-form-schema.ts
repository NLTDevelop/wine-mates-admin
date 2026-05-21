import i18n from 'i18next'
import { z } from 'zod'
import { EVENT_TYPE, FREQUENCY, PARTICIPATION_CONDITION, SEX, TASTING_TYPES } from '../entities/types/constants'

const repeatRuleConfigSchema = () =>
  z
    .object({
      frequency: z.enum(FREQUENCY),
      interval: z.number().min(1).max(365),
      weekDays: z.array(z.number().min(0).max(6)).optional(),
      endCondition: z.object({
        type: z.enum(['never', 'count', 'date']),
        value: z.union([z.number(), z.string()]).optional(),
      }),
    })
    .nullable()

export const eventFormSchema = () =>
  z.object({
    theme: z.string().trim().min(1, i18n.t('messages:theme_require')),
    description: z.string().optional().default(''),
    restaurantName: z.string().trim().min(1, i18n.t('messages:restaurant_name_require')),

    eventStartDate: z.string().min(1, i18n.t('messages:date_start_require')),
    eventEndDate: z.string().min(1, i18n.t('messages:date_end_require')),
    eventStartTime: z.string().min(1, i18n.t('messages:time_start_require')),
    eventEndTime: z.string().min(1, i18n.t('messages:time_end_require')),

    price: z
      .number()
      .optional()
      .nullable()
      .refine(
        val => {
          if (val === null || val === undefined) return true
          const isValid = val >= 0 && val <= 9999.99
          return isValid
        },
        {
          message: i18n.t('messages:price_invalid'),
        }
      ),
    currency: z.string().default('UAH'),
    seats: z
      .number()
      .optional()
      .refine(val => val !== undefined && val >= 1, {
        message: i18n.t('messages:min_seats_require'),
      }),

    speakerName: z.string().optional().default(''),
    language: z.string().min(1, i18n.t('messages:language_require')),
    phoneNumber: z.string().min(1, i18n.t('messages:phoneNumber_require')).optional(),

    minAge: z.number().min(18, i18n.t('messages:min_age')).optional().nullable(),
    maxAge: z.number().max(100, i18n.t('messages:max_age')).optional().nullable(),
    sex: z.enum(SEX).default('all'),

    eventType: z.enum(EVENT_TYPE),
    tastingType: z.enum(TASTING_TYPES),
    requiresConfirmation: z.boolean().default(false),
    repeatRule: repeatRuleConfigSchema(),
    participationCondition: z
      .union([z.enum(PARTICIPATION_CONDITION), z.null(), z.undefined(), z.literal('')])
      .optional()
      .transform(val => {
        if (val === '' || val === null) return undefined
        return val
      }),
    isActive: z.boolean().default(false),

    wineSet: z
      .array(
        z.object({
          wineId: z.number(),
          sortOrder: z.number(),
        })
      )
      .default([]),
  })

export type EventFormData = z.infer<ReturnType<typeof eventFormSchema>>
