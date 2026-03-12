import { CURRENCIES, LANGUAGES, REPEAT_RULES, TASTING_TYPES } from '@/modules/map/events/entities/types'
import { z } from 'zod'

export const createEventFormSchema = () => {
  return z.object({
    locationLabel: z.string().min(1, "Обов'язкове поле"),
    latitude: z.number(),
    longitude: z.number(),

    theme: z.string().min(1, "Обов'язкове поле"),
    restaurantName: z.string().min(1, "Обов'язкове поле"),
    eventDate: z.string().min(1, "Обов'язкове поле"),
    eventTime: z.string().min(1, "Обов'язкове поле"),

    currency: z.enum(CURRENCIES),
    price: z.number().min(0, 'Ціна має бути більше 0'),
    seats: z.number().int().min(1, 'Кількість місць має бути більше 0'),

    speakerName: z.string().nullable(),
    language: z.enum(LANGUAGES),
    phoneNumber: z
      .string()
      .min(1, "Обов'язкове поле")
      // .regex(/^[+]?[\d\s-]+$/, 'Невірний формат телефону')
      .min(10, 'Телефон має містити мінімум 10 цифр'),

    tastingType: z.enum(TASTING_TYPES),
    repeatRule: z.enum(REPEAT_RULES),
    isActive: z.boolean(),
    isOnline: z.boolean(),

    // wineSet: z.array(z.number()),
  })
}

export type EventFormData = z.infer<ReturnType<typeof createEventFormSchema>>
