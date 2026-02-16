import { z } from 'zod'

// const existingImageSchema = z.object({
//   id: z.string(),
//   url: z.string(),
//   thumbnailUrl: z.string().optional(),
//   alt: z.string().optional(),
//   order: z.number().optional(),
//   fileSize: z.number().optional(),
//   mimeType: z.string().optional(),
// })

export const createUnionWinesFormSchema = () =>
  z.object({
    id: z
      .union([z.string(), z.number()])
      .optional()
      .transform(v => v?.toString()),

    name: z.any().refine(value => value != null, { message: "" }),
    countryId: z.any().refine(value => value != null, { message: "" }),
    regionId: z.any().refine(value => value != null, { message: "" }),

    image: z.any().refine(value => value != null, { message: "" }),
  })

export type UnionWinesFormData = z.infer<ReturnType<typeof createUnionWinesFormSchema>>
