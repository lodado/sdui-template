import { z } from 'zod'

/** Image block `attributes` — source and alt text. */
export const imageAttributesSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
})

export type ImageBlockAttributes = z.infer<typeof imageAttributesSchema>
