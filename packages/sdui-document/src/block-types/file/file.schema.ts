import { z } from 'zod'

/** File block `attributes` — attachment title and size. */
export const fileAttributesSchema = z.object({
  title: z.string().optional(),
  size: z.string().optional(),
})

export type FileBlockAttributes = z.infer<typeof fileAttributesSchema>
