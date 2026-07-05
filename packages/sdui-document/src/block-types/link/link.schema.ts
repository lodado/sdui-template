import { z } from 'zod'

/** Link block `attributes` — external href and/or internal document target. */
export const linkAttributesSchema = z.object({
  href: z.string().optional(),
  targetDocumentId: z.string().optional(),
})

export type LinkBlockAttributes = z.infer<typeof linkAttributesSchema>
