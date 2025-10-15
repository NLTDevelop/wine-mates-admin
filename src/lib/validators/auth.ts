import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(6, 'Мінімум 6 символів'),
})

export type LoginFormData = z.infer<typeof loginSchema>
